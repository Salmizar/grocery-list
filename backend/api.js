const express = require('express');
const cookie = require('cookie');
const models = require('./models/index');
const bcrypt = require('bcrypt');
const api = express();
const cors = require('cors');
const crypto = require('crypto');
const cookieParams = {
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
};
const isAuthorized = (request, response) => {
    return new Promise((resolve) => {
        var cookies = cookie.parse(request.headers.cookie || '');
        if (cookies.user_id && cookies.auth_id && cookies.account_id) {
            models.Users.findAll(
                {
                    include: [{ model: models.Account_Users }],
                    where: { user_id: cookies.user_id, auth_id: cookies.auth_id }
                }
            ).then((data) => {
                if (data.length === 0) {
                    response.status(401).send();
                } else {
                    resolve(cookies);
                }
            });
        } else {
            response.status(401).send();
        }
    })
};
api.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));

//patch
api.get('/api/register/', function (request, response) {
    let name = request.query.name;
    let emailAddress = request.query.email;
    let password = request.query.password;
    let accountName = request.query.account_name;
    let authorizationId = request.query.auth_id;
    let new_auth_id = crypto.randomBytes(20).toString('hex');
    if (password.length < 5 || !name || (!request.query.account_id && !emailAddress.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
        response.status(401).send();
    } else {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        if (authorizationId) {
            models.Users.update(
                {
                    name: name,
                    password: hash,
                    auth_id: new_auth_id
                },
                {
                    where: { user_id: request.query.user_id, auth_id: authorizationId },
                    returning: true,
                    plain: true
                }
            ).then((result) => {
                let dataCopy = JSON.parse(JSON.stringify(result[1]));
                let cookies = [
                    cookie.serialize('account_id', String(request.query.account_id), cookieParams),
                    cookie.serialize('user_id', String(dataCopy.user_id), cookieParams),
                    cookie.serialize('auth_id', String(new_auth_id), cookieParams)
                ];
                response.setHeader('Set-Cookie', cookies)
                    .status(200).send();
            })
                .catch((error) => {
                    response.status(401).send();
                });
        } else {
            let reps = {
                replacements: {
                    accountName: accountName,
                    fullName: name,
                    userEmail: emailAddress,
                    auth_id: new_auth_id,
                    userPassword: hash
                }
            };
            models.sequelize.query('SELECT * FROM createAccountAndUser(:accountName, :fullName, :userEmail, :auth_id, :userPassword)', reps).then((data) => {
                if (data.length === 0) {
                    response.status(401).send();
                } else {
                    let cookies = [
                        cookie.serialize('account_id', String(data[0][0].account_id), cookieParams),
                        cookie.serialize('user_id', String(data[0][0].user_id), cookieParams),
                        cookie.serialize('auth_id', new_auth_id, cookieParams)
                    ];
                    response.setHeader('Set-Cookie', cookies)
                        .json(data[0]);
                }
            });
        }
    }
});
//patch
api.get('/api/reset/', function (request, response) {
    let email = request.query.email;
    if (!email) {
        response.status(401).send();
    } else if (request.query.new_password) {
        let new_auth_id = crypto.randomBytes(20).toString('hex');
        models.Users.update(
            {
                password: request.query.new_password,
                auth_id: new_auth_id
            },
            {
                where: { user_id: request.query.user_id, auth_id: request.query.auth_id }
            }
        ).then((data) => {
            if (data.length > 0) {
                let cookies = [
                    cookie.serialize('account_id', String(request.query.account_id), cookieParams),
                    cookie.serialize('user_id', String(request.query.user_id), cookieParams),
                    cookie.serialize('auth_id', String(new_auth_id), cookieParams)
                ];
                response.setHeader('Set-Cookie', cookies)
                    .status(200).send();
            }
        });
    } else {
        models.Users.findAll(
            {
                include: [{ model: models.Account_Users, include: { model: models.Accounts } }],
                where: { email: request.query.email }
            }
        ).then((data) => {
            if (data.length > 0) {
                //send reset email
                let nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                let resetURL = process.env.ORIGIN_URL+'/reset/'+data[0].user_id+
                                '?email='+data[0].email+
                                '&auth_id='+data[0].auth_id+
                                '&account_id='+data[0].account_users[0].account_id;
                var mailOptions = {
                    from: 'process.env.EMAIL_USERNAME',
                    to: data[0].email,
                    subject: 'My Grocery List Update Password Request',
                    html: 'Open this link in your browser to reset your password for My Grocery list!<br><br><a href="'+resetURL+'">'+
                           resetURL+
                           '</a><br><br>If this wasn\'t you, you can disregard.'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    response.status(200).send();
                });
            }
        });
    }
});
//patch
api.get('/api/users/login/:email', function (request, response) {
    let password = request.query.password;
    if (!password) {
        response.status(401).send();
    } else {
        models.Users.findAll(
            {
                include: [{ model: models.Account_Users, include: { model: models.Accounts } }],
                where: { email: request.params.email }
            }
        ).then((data) => {
            if (data.length === 0) {
                response.status(401).send();
            } else {
                if (bcrypt.compareSync(password, data[0].password)) {
                    let new_auth_id = crypto.randomBytes(20).toString('hex');
                    models.Users.update(
                        {
                            auth_id: new_auth_id
                        },
                        {
                            where: { user_id: data[0].user_id },
                            returning: true,
                            plain: true
                        }
                    ).then((result) => {
                        let dataCopy = JSON.parse(JSON.stringify(result[1]));
                        delete dataCopy.password;
                        let cookies = [
                            cookie.serialize('user_id', String(dataCopy.user_id), cookieParams),
                            cookie.serialize('auth_id', String(dataCopy.auth_id), cookieParams)
                        ];
                        switch (data[0].account_users.length) {
                            case 0:
                                response.status(401).send();
                                break;
                            case 1:
                                response.setHeader('Set-Cookie', [...cookies, cookie.serialize('account_id', String(data[0].account_users[0].account_id), cookieParams)])
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
//patch
api.get('/api/users/:user_id/update_password/:new_password', function (request, response) {
    isAuthorized(request, response).then(() => {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(request.params.new_password, salt);
        models.Users.update(
            {
                password: hash
            },
            {
                where: { user_id: request.params.user_id },
                returning: true,
                plain: true
            }
        ).then((data) => {
            if (data) {
                let dataCopy = JSON.parse(JSON.stringify(data[1]));
                delete dataCopy.password;
                delete dataCopy.auth_id;
                dataCopy.password_update_success = true;
                response.json([dataCopy]);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/users/:user_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Users.findByPk(request.params.user_id, { attributes: ['user_id', 'name', 'email'] }).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/account_users', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Account_Users.findAll(
            {
                where: { account_id: request.query.account_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/categories/', function (request, response) {
    isAuthorized(request, response).then((cookies) => {
        models.Categories.findAll(
            {
                where: { account_id: cookies.account_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/stores/', function (request, response) {
    isAuthorized(request, response).then((cookies) => {
        models.Stores.findAll(
            {
                where: { account_id: cookies.account_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/items/', function (request, response) {
    isAuthorized(request, response).then((cookies) => {
        models.Items.findAll(
            {
                where: { account_id: cookies.account_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/lists/', function (request, response) {
    isAuthorized(request, response).then((cookies) => {
        models.Lists.findAll(
            {
                where: { account_id: cookies.account_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.get('/api/list_items/:list_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.List_Items.findAll(
            {
                include: [{ model: models.Items, include: { model: models.Categories } }],
                where: { list_id: request.params.list_id },
                order: [
                    [models.sequelize.literal('order_id'), 'ASC'],
                    [models.sequelize.literal('item.name'), 'ASC']
                ]
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
api.patch('/api/list_items/:list_item_id', function (request, response) {
    console.log('/api/list_items/:list_id list_item_id:', request.params.list_item_id, ' count:',request.query.count);
    isAuthorized(request, response).then(() => {
        models.List_Items.update(
            {
                count: request.query.count
            },
            {
                where: { list_item_id: request.params.list_item_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        });
    });
});
/**
 * Configure associations
 */
models.Accounts.hasMany(models.Account_Users, { foreignKey: 'account_id' });
models.Account_Users.belongsTo(models.Accounts, { foreignKey: 'account_id' });

models.Users.hasMany(models.Account_Users, { foreignKey: 'user_id' });
models.Account_Users.belongsTo(models.Users, { foreignKey: 'user_id' });

models.Items.hasMany(models.List_Items, { foreignKey: 'item_id' });
models.List_Items.belongsTo(models.Items, { foreignKey: 'item_id' });

models.Lists.hasMany(models.List_Items, { foreignKey: 'item_id' });
models.List_Items.belongsTo(models.Lists, { foreignKey: 'item_id' });

models.Categories.hasMany(models.Items, { foreignKey: 'category_id' });
models.Items.belongsTo(models.Categories, { foreignKey: 'category_id' });

api.listen(8000);