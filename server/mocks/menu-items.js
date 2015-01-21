module.exports = function(app) {
  var express = require('express');
  var menuItemsRouter = express.Router();
  var menu = require('../fixtures/menu');

  menuItemsRouter.get('/', function(req, res) {
    res.status(200).send(menu);
  });

  app.use('/api/menu', menuItemsRouter);
};
