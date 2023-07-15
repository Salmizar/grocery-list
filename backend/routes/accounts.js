const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        helpers.models.Accounts.findAll(
            {
                where: { user_id: cookies.user_id }
            }
        ).then((data) => {
            if (data) {
                response.json(data);
            } else {
                response.status(404).send();
            }
        })
        .catch(() => {
            response.status(404).send();
        });
    });
});
module.exports = router;