var renderResponse = require('../utils/render-response');
var isValidTableNumber = require('../utils/is-valid-table-number');
var menu = require('../fixtures/menu');

function isValidRequest(data) {
  var tableNumber = data.tableNumber;
  var incomingOrderItems = data.orderItems;

  if (!isValidTableNumber(tableNumber)) {
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

    if (!isValidRequest(data)) {
      res.status(400).send({});
    } else {
      var currentItems = store[tableNumber];

      var allItems = incomingOrderItems.reduce(function(previous, current) {
        previous.push({id: current, state: 0 });
        return previous;
      }, currentItems);

      setTimeout(function() { res.status(201).send(renderResponse(allItems)); }, 2000);
    }
  });

  app.use('/api/orders', ordersRouter);
};
