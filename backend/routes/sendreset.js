const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');

router.get('/:email', function (request, response) {
    let email = request.params.email;
    if (!email) {
        response.status(401).send();
    } else {
        helpers.models.Users.findAll(
            {
                include: [{ model: helpers.models.Account_Users, include: { model: helpers.models.Accounts } }],
                where: { email: email }
            }
        ).then((data) => {
            if (data.length > 0) {
                //send reset email
                let nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                response.json(data);
                let resetURL = process.env.ORIGIN_URL + '/reset/' + data[0].user_id +
                    '?email=' + data[0].email +
                    '&auth_id=' + data[0].auth_id +
                    '&account_id=' + data[0].account_users[0].account_id;
                
                var mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: data[0].email,
                    subject: 'My Grocery List Update Password Request',
                    html: 'Open this link in your browser to reset your password for My Grocery list!<br><br><a href="' + resetURL + '">' +
                        resetURL +
                        '</a><br><br>If this wasn\'t you, you can disregard.'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    response.status(200).send();
                });
            } else {
                //No address found, randomize response length to deter detection
                let min = 300;
                let max = 1000
                setTimeout(() => { response.status(200).send() }, Math.floor(Math.random() * (max - min) + min));
            }
        })
        .catch(() => {
            response.status(200).send();
        });
    }
});
module.exports = router;