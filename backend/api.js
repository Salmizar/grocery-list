const express = require('express');
const cookie = require('cookie');
const models = require('./models/index');
const bcrypt = require('bcrypt');
const api = express();

/* 
api.get('/api/users/', function (request, response) {
    models.Users.findAll().then((data) => {
        if (data) {
            response.json(data);
        } else {
            response.status(404).send();
        }
    });
});
api.get('/api/accounts/', function (request, response) {
    models.Accounts.findAll().then((accounts) => {
        response.json(accounts);
    });
});
*/
const isAuthorized = (request, response) => {
    return new Promise((resolve) => {
        var cookies = cookie.parse(request.headers.cookie || '');
        if (cookies.user_id && cookies.auth_id) {
            models.Users.findAll(
                {
                    where: { user_id: cookies.user_id, auth_id: cookies.auth_id }
                }
            ).then((data) => {
                if (data.length === 0) {
                    response.status(401).send();
                } else {
                    resolve("authorized");
                }
            });
        } else {
            response.status(401).send();
        }
    })
};

api.get('/api/users/login/:email', function (request, response) {
    //var cookies = cookie.parse(request.headers.cookie || '');
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
                    let crypto = require('crypto');
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
                        dataCopy.loginSuccess = true;
                        delete dataCopy.password;
                        response.setHeader('Set-Cookie', cookie.serialize('user_id', String(dataCopy.user_id), {
                            path: '/',
                            maxAge: 60 * 60 * 24 * 7 // 1 week
                        }));
                        response.setHeader('Set-Cookie', cookie.serialize('auth_id', String(dataCopy.auth_id), {
                            path: '/',
                            maxAge: 60 * 60 * 24 * 7 // 1 week
                        }));
                        switch (data[0].account_users.length) {
                            case 0:
                                response.status(401).send();
                            case 1:
                                response.setHeader('Set-Cookie', cookie.serialize('account_id', String(data[0].account_users[0].account_id), {
                                    path: '/',
                                    maxAge: 60 * 60 * 24 * 7 // 1 week
                                }));
                            default:
                                dataCopy.account_users = data[0].account_users;
                                response.json(dataCopy);
                        }
                    });
                } else {
                    response.status(401).send();
                }
            }
        });
    }
});
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
api.get('/api/account_users/:account_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Account_Users.findAll(
            {
                where: { account_id: request.params.account_id }
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
api.get('/api/categories/:account_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Categories.findAll(
            {
                where: { account_id: request.params.account_id }
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
api.get('/api/stores/:account_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Stores.findAll(
            {
                where: { account_id: request.params.account_id }
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
api.get('/api/items/:account_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Items.findAll(
            {
                where: { account_id: request.params.account_id }
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
api.get('/api/lists/"account_id', function (request, response) {
    isAuthorized(request, response).then(() => {
        models.Lists.findAll(
            {
                where: { account_id: request.params.account_id }
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
                where: { list_id: request.params.list_id }
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

models.Categories.hasMany(models.Items, { foreignKey: 'category_id' });
models.Items.belongsTo(models.Categories, { foreignKey: 'category_id' });

api.listen(8000);