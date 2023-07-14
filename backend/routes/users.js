const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/:user_id', function (request, response) {
    helpers.isAuthorized(request, response).then(() => {
        helpers.models.Users.findByPk(request.params.user_id, { attributes: ['user_id', 'name', 'email'] }).then((data) => {
            if (data.length>0) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        helpers.models.Users.findAll(
            {
                attributes: ['user_id', 'name', 'email'],
                include: {model: helpers.models.Account_Users, where: {account_id : cookies.account_id}  }
            }
            ).then((data) => {
            if (data.length>0) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
router.patch('/login/:email', function (request, response) {
    let password = request.body.password;
    if (!password || !request.params.email) {
        response.status(401).send();
    } else {
        helpers.models.Users.findAll(
            {
                include: [{ model: helpers.models.Account_Users, include: { model: helpers.models.Accounts } }],
                where: { email: request.params.email }
            }
        ).then((data) => {
            if (data.length === 0) {
                response.status(401).send();
            } else {
                if (helpers.bcrypt.compareSync(password, data[0].password)) {
                    let new_auth_id = helpers.crypto.randomBytes(20).toString('hex');
                    helpers.models.Users.update(
                        { auth_id: new_auth_id },
                        {
                            where: { user_id: data[0].user_id },
                            returning: true,
                            plain: true
                        }
                    ).then((result) => {
                        let dataCopy = JSON.parse(JSON.stringify(result[1]));
                        delete dataCopy.password;
                        let cookies = [
                            helpers.cookie.serialize('user_id', String(dataCopy.user_id), helpers.cookieParams),
                            helpers.cookie.serialize('auth_id', String(dataCopy.auth_id), helpers.cookieParams)
                        ];
                        switch (data[0].account_users.length) {
                            case 0:
                                response.status(401).send();
                                break;
                            case 1:
                                response.setHeader('Set-Cookie', [...cookies, helpers.cookie.serialize('account_id', String(data[0].account_users[0].account_id), helpers.cookieParams)])
                                    .json(dataCopy);
                                break;
                            default:
                                dataCopy.account_users = data[0].account_users;
                                response.setHeader('Set-Cookie', cookies)
                                    .json(dataCopy);
                        }
                    });
                } else {
                    response.status(401).send();
                }
            }
        });
    }
});
//insert a user
router.post('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        if (request.body.name && request.body.email) {
            //confirm they are account owner
            helpers.models.Account_Users.findAll( { where: {user_id: cookies.user_id, account_id: cookies.account_id } }
                ).then((data) => {
                let inviteUserData = {};
                if (data.length>0) {
                    //Check if user already exists
                    helpers.models.Account_Users.findAll( { where: {email: request.body.email, account_id: cookies.account_id } }
                        ).then((ExistingUserData) => {
                        if (data.length === 0) {
                            //insert User
                            let new_auth_id = helpers.crypto.randomBytes(20).toString('hex');
                            helpers.models.Users.create( { name:  request.body.name, email: request.body.email, password: 'newUser', auth_id: new_auth_id }, { returning: true, plain: true }
                            ).then((userData) => {
                                if (userData.user_id > 0) {
                                    inviteUserData = userData;
                                    
                                } else {
                                    response.status(404).send();
                                }
                            });
                        } else {
                            //Existing user found, invite them instead
                            inviteUserData = ExistingUserData;
                        }
                        //insert account user
                        helpers.models.Account_Users.create(
                            { user_id:  inviteUserData.user_id, account_id: cookies.account_id }, { returning: true, plain: true }
                        ).then((data) => {
                            if (data.account_user_id>0) {
                                //Send Invite Email
                                //send reset email
                                let nodemailer = require('nodemailer');
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: process.env.EMAIL_USERNAME,
                                        pass: process.env.EMAIL_PASSWORD
                                    }
                                });
                                let registerURL = process.env.ORIGIN_URL;
                                let msg = 'Hello!<br><br>You have been invited to join a My Grocery List account.<br>Open this link in your browser to login<br><br><a href="' + registerURL + '">' +registerURL;
                                if (inviteUserData.password==='newUser') {
                                    registerURL += process.env.ORIGIN_URL + '/reset/' + inviteUserData.user_id +
                                    '?new=true&email=' + inviteUserData.email +
                                    '&auth_id=' + inviteUserData.auth_id +
                                    '&account_id=' + cookies.account_id;
                                    msg = 'Hello!<br><br>You have been invited to join a My Grocery List account.<br>Open this link in your browser to set your password and login!<br><br><a href="' + registerURL + '">' +registerURL;
                                }
                                var mailOptions = {
                                    from: process.env.EMAIL_USERNAME,
                                    to: request.body.email,
                                    subject: 'My Grocery List Invite',
                                    html: msg
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                    response.status(200).send();
                                });
                                //If all went well, return new user
                                response.json(inviteUserData);
                            } else {
                                response.status(404).send();
                            }
                        });
                });
                } else {
                    response.status(404).send();
                }
            });
        } else {
            response.status(404).send();
        }
    });
});
//delete a user
router.delete('/:store_id', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        if (request.params.store_id) {
            helpers.models.Stores.destroy(
                {
                    where: { store_id: request.params.store_id, account_id: cookies.account_id },
                }
            ).then((data) => {
                if (data.length>0) {
                    response.json(data);
                } else {
                    response.status(404).send();
                }
            });
        } else {
            response.status(404).send();
        }
    });
});
module.exports = router;

