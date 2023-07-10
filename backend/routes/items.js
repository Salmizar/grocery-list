const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        helpers.models.Items.findAll(
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
module.exports = router;