module.exports = function(app) {
  var Memcached = require('memcached');
  var memcached = new Memcached('127.0.0.1:11211');
  var express = require('express');
  var crabmansCrabshackRouter = express.Router();
  var NUMBER_OF_TABLES = 6;
  var CACHE_TIME = 3 * 60 * 60;
  var FOOD_STATES = ['order received', 'preparing', 'chef spitting in food', 'cooking', 'delivered'];

  var menu = {
      'Prawn Cocktail': {
        type: 'starter',
        description: 'A modern starter for the modern man',
        price: '3.99'
      },
      'Crab Platter': {
        type: 'starter',
        description: 'Truly crabby platter',
        price: '8.00'
      },
      'Claw of Crabulon': {
        type: 'main',
        description: 'Keep calm and Crabulon',
        price: '12.85'
      },
      'Crab and Chips': {
        type: 'main',
        description: 'A crabby take on a classic',
        price: '10.49'
      },
      'Vegetarian Crab': {
        type: 'main',
        description: 'Crab meat made from the best nautical tofu',
        price: '11.99'
      },
      'Crabman Sundae': {
        type: 'dessert',
        description: 'Ground up crabs with animal fat ice cream. A variety of sauces available.',
        price: '4.90'
      },
      'Craw Brulee': {
        type: 'dessert',
        description: 'Brulee made with the finest claw in Brentford',
        price: '3.80'
      },
      'Crabwerries & Seawater': {
        type: 'dessert',
        description: 'Organically grown crawberries with distilled sea water imported from the Pacific',
        price: '4.99'
      },
      'Crabba Cola': {
        type: 'beverage',
        description: 'Coca-cola but with our unique distinct crabby flavour',
        price: '1.80'
      },
      'Alcoholic milkshake': {
        type: 'beverage',
        description: 'The best alcoholic milkshake you will taste this side of the Atlantic.',
        price: '3.99'
      }
    };

  var menuItems = [];

  for (var k in menu) { menuItems.push(k); }

  for (var i=1; i <= NUMBER_OF_TABLES; i++) {
    memcached.set(i, [ ], CACHE_TIME, function(err) {
      if(err) {
        console.log('error setting up table', err);
      }
    });
  }

  var chaosFoodMonkey = setInterval(function() {
    for (var i = 1; i <= NUMBER_OF_TABLES; i++) {
      _randomlyProgressFoodOrdersForTable(i);
    }
  }, 10000);

  crabmansCrabshackRouter.get('/menu', function(req, res) {
    setTimeout(function() { res.status(200).send(menu); }, 1000);
  });

  crabmansCrabshackRouter.post('/orders', function(req, res) {
    var tableNumber = req.body.tableNumber;
    var incomingOrderItems = req.body.orderItems;

    if (!tableNumber || !incomingOrderItems || !Array.isArray(incomingOrderItems ) ||incomingOrderItems .length === 0) {
      res.status(400).send({});
    } else if (tableNumber < 1 || tableNumber > NUMBER_OF_TABLES) {
      res.status(404).send({});
    } else {
      memcached.get(tableNumber, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          var existingOrderItems = data || [];
          var updatedOrderItems = existingOrderItems;

          for (var i = 0; i < incomingOrderItems.length; i++) {
            if (menuItems.indexOf(incomingOrderItems[i]) < 0) {
              res.status(400).send({});
              return;
            }
            updatedOrderItems.push({id: incomingOrderItems[i], state: 0 });
          }

          memcached.set(tableNumber, updatedOrderItems, CACHE_TIME,  function(err) {
            if(err) {
              console.log(err);
              res.status(500).send({});
            } else {
              res.status(201).send(_renderResponse(updatedOrderItems));
            }
          });
        }
      });

    }
  });

  crabmansCrabshackRouter.get('/table/:tableNumber', function(req, res) {
    var tableNumber = req.params.tableNumber;

    if (tableNumber && tableNumber > 0 && tableNumber <= NUMBER_OF_TABLES) {
      memcached.get(req.params.tableNumber, function(err, data) {
        var response = _renderResponse(data);
        setTimeout(function() { res.status(200).send(response); }, 1000);
      });
    } else {
      res.status(404).send({});
    }
  });

  crabmansCrabshackRouter.post('/payments', function(req, res) {
    var cardNumber = req.body.cardNumber;
    var securityCode = req.body.securityCode;
    var tableNumber = req.body.tableNumber;

    var cardDeclined = (Math.random() > 0.9) ? true : false;

    if (!tableNumber) {
      res.status(404).send({});
    } else if (!cardNumber || !securityCode || cardNumber.length !== 16 || securityCode.length !== 3) {
      res.status(400).send({});
    } else if (cardDeclined) {
      setTimeout(function() {res.status(502).send({});}, 3000);
    } else {
      memcached.set(tableNumber, [], CACHE_TIME, function(err) {
        setTimeout(function() {res.status(200).send({});}, 3000);
      });
    }

  });

  var _renderResponse = function(order) {
    var humanReadableOrderItems = [];
    for (var i = 0; i < order.length; i++) {
      humanReadableOrderItems.push({id: order[i].id, state: FOOD_STATES[order[i].state]});
    }
    return {orderItems: humanReadableOrderItems, total: _calculateTotal(order)};
  };

  var _calculateTotal = function(order) {
    if (order.length === 0) {
      return 0;
    }
    var total = 0;
    for (item in order) {
      var price = parseFloat(menu[order[item].id].price);
      total += price;
    }
    return total;
  };

  var _randomlyProgressFoodOrdersForTable = function(table) {
    memcached.get(table, function(err, data) {
      for (item in data) {
        var currentState = data[item].state;
        if (currentState < (FOOD_STATES.length - 1) && Math.random() > 0.5) {
          data[item].state++;
          console.log('Table ' + table + ' order ' + data[item].id + ' is now in state ' + data[item].state);
        }
      }
      memcached.set(table, data, CACHE_TIME, function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  app.use('/api', crabmansCrabshackRouter);
};

