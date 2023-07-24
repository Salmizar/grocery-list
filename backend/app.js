const express = require('express');
const models = require('./models/index');
const api = express();
const cors = require('cors');
const port = 8000;
api.use(cors({ origin: process.env.ORIGIN_URL.split(','), credentials: true }));
//needed in order to process content into request.body
api.use(express.json());
/* Routes */
api.use('/', require('./routes/system'));
api.use('/api/register/', require('./routes/register'));
api.use('/api/sendreset/', require('./routes/sendreset'));
api.use('/api/reset/', require('./routes/reset'));
api.use('/api/accounts/', require('./routes/system'));
api.use('/api/users/', require('./routes/users'));
api.use('/api/categories/', require('./routes/categories'));
api.use('/api/stores/', require('./routes/stores'));
api.use('/api/items/', require('./routes/items'));
api.use('/api/lists/', require('./routes/lists'));
api.use('/api/list_items/', require('./routes/list_items'));
/**
 * Configure associations
 */
models.Users.hasMany(models.Accounts, { foreignKey: 'account_id' });
models.Accounts.belongsTo(models.Users, { foreignKey: 'account_id' });

models.Users.hasMany(models.Account_Users, { foreignKey: 'account_id' });
models.Account_Users.belongsTo(models.Users, { foreignKey: 'account_id' });

models.Accounts.hasMany(models.Account_Users, { foreignKey: 'account_id' });
models.Account_Users.belongsTo(models.Accounts, { foreignKey: 'account_id' });

models.Users.hasMany(models.Account_Users, { foreignKey: 'user_id' });
models.Account_Users.belongsTo(models.Users, { foreignKey: 'user_id' });

models.Items.hasMany(models.List_Items, { foreignKey: 'item_id' });
models.List_Items.belongsTo(models.Items, { foreignKey: 'item_id' });

models.Lists.hasMany(models.List_Items, { foreignKey: 'item_id' });
models.List_Items.belongsTo(models.Lists, { foreignKey: 'item_id' });

models.Categories.hasMany(models.Items, { foreignKey: 'category_id' });
models.Items.belongsTo(models.Categories, { foreignKey: 'category_id' });

api.listen(port);