
const models = require('../models/index');
exports.models = models;
const cookie = require('cookie');
exports.cookie = cookie;
const bcrypt = require('bcrypt');
exports.bcrypt = bcrypt;
exports.crypto = require('crypto');
exports.cookieParams = {
    path: '/',
    //secure: true, sameSite: 'none" //In order to set cross domain cookies
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
};
exports.isAuthorized = (request, response) => {
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