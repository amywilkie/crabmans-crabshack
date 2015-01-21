module.exports = function(app) {
  var express = require('express');
  var crabmansCrabshackRouter = express.Router();
  var NUMBER_OF_TABLES = 6;
  var menu = require('../fixtures/menu');
  var FOOD_STATES = ['order received', 'preparing', 'chef spitting in food', 'cooking', 'delivered'];
  var store = {};

  clearStore();


  var chaosFoodMonkey = setInterval(function() {
    for (var i = 1; i <= NUMBER_OF_TABLES; i++) {
      _randomlyProgressFoodOrdersForTable(i);
    }
  }, 10000);

  crabmansCrabshackRouter.get('/menu', function(req, res) {
    res.status(200).send(menu);
  });

  crabmansCrabshackRouter.post('/orders', function(req, res) {
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

      setTimeout(function() { res.status(201).send(_renderResponse(allItems)); }, 2000);
    }
  });

  crabmansCrabshackRouter.get('/table/:tableNumber', function(req, res) {
    var tableNumber = req.params.tableNumber;

    if (!_isValidTableNumber(tableNumber)) {
      res.status(404).send({});
    }

    var currentOrderItems = store[tableNumber];
    var response = _renderResponse(currentOrderItems);
    setTimeout(function() { res.status(200).send(response); }, 1000);
  });

  crabmansCrabshackRouter.post('/payments', function(req, res) {
    var cardNumber = req.body.cardNumber;
    var securityCode = req.body.securityCode;
    var tableNumber = req.body.tableNumber;
    var cardDeclined = (Math.random() > 0.9) ? true : false;

    if (!_isValidTableNumber(tableNumber) || !_isValidCard(cardNumber, securityCode)) {
      res.status(400).send({});
    } else if (cardDeclined) {
      setTimeout(function() {res.status(502).send({});}, 3000);
    } else {
      _resetTable(tableNumber);
      setTimeout(function() {res.status(200).send({});}, 3000);
    }

  });

  crabmansCrabshackRouter.get('/reset', function(req, res) {
    clearStore();
    res.status(200).send({});
  });

  var _renderResponse = function(order) {
    var humanReadableOrderItems = order.map(function(item) {
      return {id: item.id, state: FOOD_STATES[item.state]};
    });

    return {orderItems: humanReadableOrderItems, total: _calculateTotal(order)};
  };

  var _calculateTotal = function(order) {
    if (order.length === 0) {
      return "0.00";
    }
    var total = 0;

    for (item in order) {
      var price = parseFloat(menu[order[item].id].price);
      total += price;
    }
    return total.toFixed(2).toString();
  };

  var _randomlyProgressFoodOrdersForTable = function(table) {
    var data = store[table];

    for (item in data) {
      var currentState = data[item].state;
      if (currentState < (FOOD_STATES.length - 1) && Math.random() > 0.5) {
        data[item].state++;
        console.log('Table ' + table + ' order ' + data[item].id + ' is now in state ' + data[item].state);
      }
    }

    store[table] = data;
  }

  function _isValidCard(cardNumber, securityCode) {
    if (!cardNumber || !securityCode || cardNumber.length !== 16 || securityCode.length !== 3) {
      return false;
    }
    return true;
  }

  function _isValidTableNumber(tableNumber) {
    if (!tableNumber || tableNumber < 1 || tableNumber > NUMBER_OF_TABLES) {
      return false;
    }
    return true;
  }

  function _resetTable(tableNumber) {
    store[tableNumber] = [];
  }

  function isValidRequest(data) {
    var tableNumber = data.tableNumber;
    var incomingOrderItems = data.orderItems;

    if (!_isValidTableNumber(tableNumber)) {
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

  function clearStore() {
    for (var i=1; i <= NUMBER_OF_TABLES; i++) {
      _resetTable(i);
    }
  }

  app.use('/api', crabmansCrabshackRouter);
};

