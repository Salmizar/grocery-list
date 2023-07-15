const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers')
router.get('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        helpers.models.Lists.findAll(
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
//update a list
router.patch('/:list_id', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        if (request.params.list_id) {
            helpers.models.Lists.update(
                {
                    name: request.body.name
                },
                {
                    where: { list_id: request.params.list_id, account_id: cookies.account_id }
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
//insert a list
router.post('/', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        if (request.body.name) {
            helpers.models.Lists.create( 
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
            })
            .catch((error) => {
                console.log('error',error);
                response.status(404).send();
            });
        } else {
            response.status(404).send();
        }
    });
});
//delete a list
router.delete('/:list_id', function (request, response) {
    helpers.isAuthorized(request, response).then(([cookies,isAdmin]) => {
        if (request.params.list_id) {
            helpers.models.Lists.destroy(
                {
                    where: { list_id: request.params.list_id, account_id: cookies.account_id },
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
module.exports = router;