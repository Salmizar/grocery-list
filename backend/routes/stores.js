const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        helpers.models.Stores.findAll(
            {
                where: { account_id: cookies.account_id },
                order: [
                    ['name', 'ASC']
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
//update a store
router.patch('/:store_id', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        if (request.params.store_id) {
            helpers.models.Stores.update(
                {
                    name: request.body.name
                },
                {
                    where: { store_id: request.params.store_id, account_id: cookies.account_id }
                }
            ).then((data) => {
                if (data) {
                    response.json(data);
                } else {
                    response.status(404).send();
                }
            });
        } else {
            response.status(404).send();
        }
    });
});
//insert a store
router.post('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        if (request.body.name) {
            helpers.models.Stores.create(
                {
                    name:  request.body.name,
                    account_id: cookies.account_id
                },
                {
                    returning: true,
                    plain: true
                }
            ).then((data) => {
                if (data) {
                    response.json(data);
                } else {
                    response.status(404).send();
                }
            });
        } else {
            response.status(404).send();
        }
    });
});
//delete a store
router.delete('/:store_id', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        if (request.params.store_id) {
            helpers.models.Stores.destroy(
                {
                    where: { store_id: request.params.store_id, account_id: cookies.account_id },
                }
            ).then((data) => {
                if (data) {
                    response.json(data);
                } else {
                    response.status(404).send();
                }
            });
        } else {
            response.status(404).send();
        }
    });
});
module.exports = router;