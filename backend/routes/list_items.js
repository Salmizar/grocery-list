const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');
const { queryTypes } = require('sequelize');
//'@sequelize/core';

//get all list_items for a given list
router.get('/:list_id', function (request, response) {
    helpers.isAuthorized(request, response).then((cookies) => {
        if (request.params.list_id) {
            if (request.query.allItems==='true') {
                let query = `select items.item_id, items.account_id, items.name AS "item_name", items.category_id, categories.name AS "category_name", categories.order_id, items.store_ids, list_items.count, list_items.list_item_id
                FROM items AS items
                LEFT OUTER JOIN list_items ON items.item_id = list_items.item_id AND list_items.list_id = ${request.params.list_id}
                LEFT OUTER JOIN categories ON items.category_id = categories.category_id
                WHERE items.account_id = ${cookies.account_id}
                ORDER BY categories.order_id ASC, items.name ASC`;
                helpers.models.sequelize.query(query, {model:helpers.models.Items, mapToModel: true}).then((data) => {
                    if (data.length === 0) {
                        response.status(401).send();
                    } else {
                        
                        response.json(data);
                    }
                });
            } else {
                helpers.models.List_Items.findAll(
                    {
                        include: [{ model: helpers.models.Items, include: { model: helpers.models.Categories } }],
                        where: { list_id: request.params.list_id },
                        order: [
                            [helpers.models.sequelize.literal('order_id'), 'ASC'],
                            [helpers.models.sequelize.literal('item.name'), 'ASC']
                        ]
                    }
                ).then((data) => {
                    if (data) {
                        response.json(data);
                    } else {
                        response.status(404).send();
                    }
                });
            }
        }
    });
});
//update a list item
router.patch('/:list_item_id', function (request, response) {
    helpers.isAuthorized(request, response).then(() => {
        let count = Number(request.body.count);
        if (!isNaN(count) && count >= 0 && request.params.list_item_id) {
            helpers.models.List_Items.update(
                {
                    count: request.body.count
                },
                {
                    where: { list_item_id: request.params.list_item_id }
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