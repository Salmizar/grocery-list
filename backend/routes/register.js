const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.patch('/', function (request, response) {
    let name = request.body.name;
    let emailAddress = request.body.email;
    let password = request.body.password;
    let accountName = request.body.account_name;
    let authorizationId = request.body.auth_id;
    let new_auth_id = helpers.crypto.randomBytes(20).toString('hex');
    if (password.length < 5 || !name || (!request.body.account_id && !emailAddress.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
        response.status(401).send();
    } else {
        let salt = helpers.bcrypt.genSaltSync(10);
        let hash = helpers.bcrypt.hashSync(password, salt);
        if (authorizationId) {
            //register to existing account
            helpers.models.Users.update(
                {
                    name: name,
                    password: hash,
                    auth_id: new_auth_id
                },
                {
                    where: { user_id: request.body.user_id, auth_id: authorizationId },
                    returning: true,
                    plain: true
                }
            ).then((result) => {
                let dataCopy = JSON.parse(JSON.stringify(result[1]));
                let cookies = [
                    helpers.cookie.serialize('account_id', String(request.body.account_id), helpers.cookieParams),
                    helpers.cookie.serialize('user_id', String(dataCopy.user_id), helpers.cookieParams),
                    helpers.cookie.serialize('auth_id', String(new_auth_id), helpers.cookieParams)
                ];
                response.setHeader('Set-Cookie', cookies)
                    .status(200).send();
            })
                .catch((error) => {
                    response.status(401).send();
                });
        } else {
            //new account resgistration
            let reps = {
                replacements: {
                    accountName: accountName,
                    fullName: name,
                    userEmail: emailAddress,
                    auth_id: new_auth_id,
                    userPassword: hash
                }
            };
            helpers.models.sequelize.query('SELECT * FROM createAccountAndUser(:accountName, :fullName, :userEmail, :auth_id, :userPassword)', reps).then((data) => {
                if (data.length === 0) {
                    response.status(401).send();
                } else {
                    let cookies = [
                        helpers.cookie.serialize('account_id', String(data[0][0].account_id), helpers.cookieParams),
                        helpers.cookie.serialize('user_id', String(data[0][0].user_id), helpers.cookieParams),
                        helpers.cookie.serialize('auth_id', new_auth_id, helpers.cookieParams)
                    ];
                    response.setHeader('Set-Cookie', cookies)
                        .json(data[0]);
                }
            });
        }
    }
});
module.exports = router;

