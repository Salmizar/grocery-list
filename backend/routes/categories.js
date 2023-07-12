const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers')
router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        helpers.models.Categories.findAll(
            {
                where: { account_id: cookies.account_id },
                order: [
                    ['order_id', 'ASC']
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
//update a category
router.patch('/:category_id', function (request, response) {
    helpers.isAuthorized(request, response).then(() => {
        if (request.params.category_id) {
            helpers.models.Categories.update(
                {
                    name: request.body.name
                },
                {
                    where: { category_id: request.params.category_id }
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
//insert a category
router.post('/', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        let order_id = Number(request.body.order_id);
        if (order_id >= 0 && request.body.name) {
            helpers.models.Categories.create(
                {
                    name:  request.body.name,
                    order_id:  request.body.order_id,
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
//delete a category
router.delete('/:category_id', function (request, response) {
    helpers.isAuthorized(request, response).then(() => {
        if (request.params.category_id) {
            helpers.models.Categories.destroy(
                {
                    where: { category_id: request.params.category_id },
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