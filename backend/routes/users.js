const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/:user_id', function (request, response) {
    helpers.isAuthorized(request, response).then(() => {
        helpers.models.Users.findByPk(request.params.user_id, { attributes: ['user_id', 'name', 'email'] }).then((data) => {
            if (data) {
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
module.exports = router;

