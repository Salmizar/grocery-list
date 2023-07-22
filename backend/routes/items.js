const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies]) => {
        helpers.models.Items.findAll(
            {
                where: { account_id: cookies.account_id },
                order: [
                    ['name', 'ASC']
                ]
            }
        ).then((data) => {
            response.json(data);
        })
        .catch(() => {
            response.status(404).send();
        });
    });
});
//update a item
router.patch('/:item_id', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies]) => {
        if (!isNaN(Number(request.params.item_id)) && request.body.name && request.body.category_id && request.body.store_ids) {
            helpers.models.Items.update(
                {
                    name: request.body.name,
                    category_id: request.body.category_id,
                    store_ids: request.body.store_ids
                },
                {
                    where: { item_id: request.params.item_id, account_id: cookies.account_id }
                }
            ).then((data) => {
                if (data) {
                    helpers.models.Items.findAll(
                        {
                            where: { account_id: cookies.account_id, item_id: request.params.item_id },
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
                    })
                    .catch(() => {
                        response.status(404).send();
                    });
                } else {
                    response.status(404).send();
                }
            })
            .catch(() => {
                response.status(404).send();
            });
        } else {
            response.status(404).send();
        }
    });
});
//insert a item
router.post('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies]) => {
        if (request.body.name) {
            let parms = {
                name: request.body.name,
                account_id: cookies.account_id
            };
            if (request.body.category_id && request.body.category_id > 0) {
                parms.category_id =  request.body.category_id;
            }
            if (request.body.store_ids) {
                parms.store_ids =  request.body.store_ids;
            }
            helpers.models.Items.create(
                parms,
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
            })
            .catch(() => {
                response.status(404).send();
            });
        } else {
            response.status(404).send();
        }
    });
});
//delete a item
router.delete('/:item_id', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies]) => {
        if (request.params.item_id) {
            helpers.models.Items.destroy({ where: { item_id: request.params.item_id, account_id: cookies.account_id } }
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
        } else {
            response.status(404).send();
        }
    });
});
module.exports = router;