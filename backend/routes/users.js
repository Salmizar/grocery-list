const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/:user_id', function (request, response) {
    helpers.isAuthorized(request, response).then(() => {
        helpers.models.Users.findByPk(request.params.user_id, { attributes: ['user_id', 'name', 'email'] }).then((data) => {
            response.json(data);
        })
            .catch(() => {
                response.status(404).send();
            });
    });
});
router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies, isAdmin]) => {
        helpers.models.Users.findAll(
            {
                attributes: ['user_id', 'name', 'email'],
                include: { model: helpers.models.Account_Users, where: { account_id: cookies.account_id } },
                order: [
                    ['name', 'ASC']
                ]
            }
        ).then((data) => {
            response.json(data);
        })
            .catch(() => {
                response.status(404).send();
            });
    });
});
//user login
router.patch('/login/:email', function (request, response) {
    let password = request.body.password;
    if (!password || !request.params.email) {
        response.status(401).send();
    } else {
        //get user with email so we can check password
        helpers.models.Users.findAll(
            {
                include: [{ model: helpers.models.Account_Users, include: { model: helpers.models.Accounts } }],
                where: { email: request.params.email }
            }
        ).then((user) => {
            if (user.length === 0) {
                response.status(401).send();
            } else {
                //user exists now get their admin status
                helpers.models.Users.findAll(
                    {
                        include: [{ model: helpers.models.Account_Users, include: { model: helpers.models.Accounts, where: { user_id: user[0].user_id } } }],
                        where: { user_id: user[0].user_id, auth_id: user[0].auth_id }
                    }
                ).then((user) => {
                    //compare passwords
                    if (helpers.bcrypt.compareSync(password, user[0].password)) {
                        let new_auth_id = helpers.crypto.randomBytes(20).toString('hex');
                        //passwords match, update user auth
                        helpers.models.Users.update(
                            { auth_id: new_auth_id },
                            {
                                where: { user_id: user[0].user_id },
                                returning: true,
                                plain: true
                            }
                        ).then((result) => {
                            let dataCopy = structuredClone(result[1].dataValues);
                            delete dataCopy.password;
                            let cookies = [
                                helpers.cookie.serialize('user_id', String(dataCopy.user_id), helpers.cookieParams),
                                helpers.cookie.serialize('auth_id', String(dataCopy.auth_id), helpers.cookieParams),
                                helpers.cookie.serialize('isAdmin', String(user[0].account_users.length > 0), helpers.cookieParams)
                            ];
                            switch (user[0].account_users.length) {
                                case 0:
                                    response.status(401).send();
                                    break;
                                case 1:
                                    response.setHeader('Set-Cookie', [...cookies, helpers.cookie.serialize('account_id', String(user[0].account_users[0].account_id), helpers.cookieParams)])
                                        .json(dataCopy);
                                    break;
                                default:
                                    userCopy.account_users = data[0].account_users;
                                    response.setHeader('Set-Cookie', cookies)
                                        .json(dataCopy);
                            }
                        })
                            .catch(() => {
                                response.status(404).send();
                            });
                    } else {
                        response.status(401).send();
                    }
                })
                    .catch(() => {
                        response.status(404).send();
                    });

            }
        })
            .catch(() => {
                response.status(404).send();
            });
    }
});
//insert a user
router.post('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        console.log('user post', request.body.name , request.body.email , isAdmin);
        if (request.body.name && request.body.email && isAdmin) {
            let inviteUserData = {};
            //Check if user already exists
            helpers.models.Users.findAll({ where: { email: request.body.email } }
            ).then((existingUserData) => {
                if (existingUserData.length === 0) {
                    //insert User
                    let new_auth_id = helpers.crypto.randomBytes(20).toString('hex');
                    helpers.models.Users.create({ name: request.body.name, email: request.body.email, password: 'newUser', auth_id: new_auth_id }, { returning: true, plain: true }
                    ).then((userData) => {
                        if (userData.user_id > 0) {
                            inviteUserData = userData;
                        } else {
                            response.status(404).send();
                        }
                    })
                        .catch(() => {
                            response.status(404).send();
                        });
                } else {
                    //Existing user found, invite them instead
                    inviteUserData = existingUserData[0];
                }
                //insert account user
                helpers.models.Account_Users.create(
                    { user_id: inviteUserData.user_id, account_id: cookies.account_id }, { returning: true, plain: true }
                ).then((newUserData) => {
                    if (newUserData.account_user_id > 0) {
                        //Send Invite Email
                        let nodemailer = require('nodemailer');
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_USERNAME,
                                pass: process.env.EMAIL_PASSWORD
                            }
                        });
                        let registerURL = process.env.ORIGIN_URL;
                        let msg = 'Hello!<br><br>You have been invited to join a My Grocery List account.<br>Open this link in your browser to login<br><br><a href="' + registerURL + '">' + registerURL;
                        if (inviteUserData.password === 'newUser') {
                            registerURL += process.env.ORIGIN_URL + '/reset/' + inviteUserData.user_id +
                                '?new=true&email=' + inviteUserData.email +
                                '&auth_id=' + inviteUserData.auth_id +
                                '&account_id=' + cookies.account_id;
                            msg = 'Hello!<br><br>You have been invited to join a My Grocery List account.<br>Open this link in your browser to set your password and login!<br><br><a href="' + registerURL + '">' + registerURL;
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
                })
                    .catch(() => {
                        response.status(404).send();
                    });
            })
                .catch(() => {
                    response.status(404).send();
                });
        } else {
            response.status(404).send();
        }

    });
});
//update a user
router.patch('/:user_id', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        if (request.body.name && request.body.email) {
            //logged in user, making changes to their account
            if (request.params.user_id === cookies.user_id) {
                let params = {
                    name: request.body.name,
                    email: request.body.email
                };
                if (request.body.password) {
                    let salt = helpers.bcrypt.genSaltSync(10);
                    let hash = helpers.bcrypt.hashSync(request.body.password, salt);
                    params.password =  hash;
                }
                helpers.models.Users.update(params,
                    {
                        where: { user_id: cookies.user_id, auth_id: cookies.auth_id },
                        returning: true,
                        plain: true
                    }
                ).then((data) => {
                    if (data) {
                        let dataCopy = structuredClone(data[1].dataValues);
                        delete dataCopy.password;
                        delete dataCopy.auth_id;
                        response.json(dataCopy);
                    } else {
                        response.status(404).send();
                    }
                })
                    .catch(() => {
                        response.status(404).send();
                    });
            } else {
                if (isAdmin) {
                    helpers.models.Users.update(
                        { name: request.body.name, email: request.body.email },
                        {
                            where: { user_id: request.params.user_id },
                            returning: true,
                            plain: true
                        }
                    ).then((data) => {
                        if (data.length > 0) {
                            //resend Invite Email
                            let nodemailer = require('nodemailer');
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL_USERNAME,
                                    pass: process.env.EMAIL_PASSWORD
                                }
                            });
                            let registerURL = process.env.ORIGIN_URL;
                            let msg = 'Hello!<br><br>The Admin updated your account details on their My Grocery List account.<br>Open this link in your browser to login<br><br><a href="' + registerURL + '">' + registerURL;
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
                                //If all went well, return updated user, strip away sensitive data
                                let dataCopy = structuredClone(data[1].dataValues);
                                delete dataCopy.password;
                                delete dataCopy.auth_id;
                                response.json(dataCopy);
                            });
                        } else {
                            response.status(404).send();
                        }
                    })
                        .catch(() => {
                            response.status(404).send();
                        });
                } else {
                    response.status(404).send();
                }
            }
        } else {
            response.status(404).send();
        }
    });
});
//delete a user, which will simply remove them from the account
router.delete('/:user_id', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies, isAdmin]) => {
        if (request.params.user_id) {
            //confirm they are account owner
            helpers.models.Account_Users.findAll({ where: { user_id: cookies.user_id, account_id: cookies.account_id } }
            ).then((data) => {
                if (data.length > 0) {
                    if (data.length > 0) {
                        helpers.models.Account_Users.destroy(
                            {
                                where: { user_id: request.params.user_id, account_id: cookies.account_id },
                            }
                        ).then((data) => {
                            if (data) {
                                response.status(200).send();
                            } else {
                                response.status(404).send();
                            }
                        })
                            .catch(() => {
                                response.status(404).send();
                            });
                    }
                }
            })
                .catch(() => {
                    response.status(404).send();
                });

        } else {
            response.status(404).send();
        }
    });
});
module.exports = router;

