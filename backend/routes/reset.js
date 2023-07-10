const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.patch('/:email', function (request, response) {
    let email = request.body.email;
    if (email && request.body.new_password && request.body.auth_id && request.body.user_id) {
        let new_auth_id = helpers.crypto.randomBytes(20).toString('hex');
        let salt = helpers.bcrypt.genSaltSync(10);
        let hash = helpers.bcrypt.hashSync(request.body.new_password, salt);
        helpers.models.Users.update(
            {
                password: hash,
                auth_id: new_auth_id
            },
            {
                where: { user_id: request.body.user_id, auth_id: request.body.auth_id }
            }
        ).then((data) => {
            if (data.length > 0) {
                let cookies = [
                    helpers.cookie.serialize('account_id', String(request.body.account_id), helpers.cookieParams),
                    helpers.cookie.serialize('user_id', String(request.body.user_id), helpers.cookieParams),
                    helpers.cookie.serialize('auth_id', String(new_auth_id), helpers.cookieParams)
                ];
                response.setHeader('Set-Cookie', cookies)
                    .status(200).send();
            }
        });
    } else {
        response.status(401).send();
    }
});
module.exports = router;