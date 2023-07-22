const express = require('express');
const models = require('./models/index');
const api = express();
const cors = require('cors');
const port = 8000;
const http = require('http');
const debug = require('debug')('test:server');
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

//api.listen(port);



// catch 404 and forward to error handler
var createError = require('http-errors');
api.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  api.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  
var server = http.createServer(api);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }4
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }