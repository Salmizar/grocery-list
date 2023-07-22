require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgresql' });

const models = [
    'Users',
    'Lists',
    'List_Items',
    'Stores',
    'Categories',
    'Items',
    'Account_Users',
    'Accounts'
];

models.forEach(function (model) {
    module.exports[model] = require('./' + model.toLowerCase())(sequelize, Sequelize.DataTypes);
});
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;