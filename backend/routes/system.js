const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/database/', function (request, response) {
    helpers.models.Users.findAll(
        {
            attributes: ['user_id'],
            where: { user_id: 1 }
        }
    ).then((data) => {
        if (data.length > 0) {
            response.status(200).send();
        }
    }).catch(() => {
        response.status(500).send();
    });
});

router.get('/', function (request, response) {

    response.json({'API': 'online'});
});

module.exports = router;