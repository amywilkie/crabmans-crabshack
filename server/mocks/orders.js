var renderResponse = require('../utils/render-response');
var menu = require('../fixtures/menu');

function isValidRequest(data, store) {
  var tableNumber = data.tableNumber;
  var incomingOrderItems = data.orderItems;

  if (!store.getTable(tableNumber)) {
    return false;
  }

  if (!incomingOrderItems || !incomingOrderItems.length || incomingOrderItems.length === 0 ) {
    return false;
  }

  for (var item in incomingOrderItems) {
    var itemName = incomingOrderItems[item];
    if (!menu[itemName]) {
      return false;
    }
  }

  return true;
}

module.exports = function(app, store) {
  var express = require('express');
  var ordersRouter = express.Router();

  ordersRouter.post('/', function(req, res) {
    var data = req.body || {};
    var tableNumber = data.tableNumber;
    var incomingOrderItems = data.orderItems;

    if (!isValidRequest(data, store)) {
      res.status(400).send({});
    } else {
      incomingOrderItems.forEach(function(item) {
        store.addItemToTable(tableNumber, {id: item, state: 0});
      });

      setTimeout(function() { res.status(201).send(renderResponse(store.getTable(tableNumber))); }, 2000);
    }
  });

  app.use('/api/orders', ordersRouter);
};
