module.exports = function(app) {
  var Memcached = require('memcached');
  var memcached = new Memcached('127.0.0.1:11211');
  var express = require('express');
  var crabmansCrabshackRouter = express.Router();
  var NUMBER_OF_TABLES = 6;
  var CACHE_TIME = 3 * 60 * 60;
  var FOOD_STATES = ['order received', 'preparing', 'chef spitting in food', 'cooking', 'delivered'];

  var menu = {
      "Prawn Cocktail": {
        type: 'starter',
        description: 'A modern starter for the modern man',
        price: '3.99'
      },
      "Claw of Crabulon": {
        type: 'main',
        description: 'Keep calm and Crabulon',
        price: '12.85'
      },
      "Crabman Sundae": {
        type: 'dessert',
        description: 'Ground up crabs with animal fat ice cream. A variety of sauces available.',
        price: '4.90'
      },
      "Alcoholic milkshake": {
        type: 'beverage',
        description: 'The best alcoholic milkshake you will taste this side of the Atlantic.',
        price: '3.99'
      }
    };

  var menuItems = [];
  for (var k in menu) { menuItems.push(k); }

  for (var i=1; i <= NUMBER_OF_TABLES; i++) {
    memcached.set(i, {orderItems : [ ], total: 0}, CACHE_TIME, function(err) {
      if(err) {
        console.log('error setting up table', err);
      }
    });
  }

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
          var existingOrderItems = data.orderItems || [];
          var updatedOrderItems = existingOrderItems;

          for (var i = 0; i < incomingOrderItems.length; i++) {
            if (menuItems.indexOf(incomingOrderItems[i]) < 0) {
              res.status(400).send({});
              return;
            }
            updatedOrderItems.push({id: incomingOrderItems[i], state: 0 });
          }

          memcached.set(tableNumber, { orderItems: updatedOrderItems, total: 0}, CACHE_TIME,  function(err) {
            if(err) {
              console.log(err);
              res.status(500).send({});
            } else {
              res.status(201).send(_makeFoodStatesHumanReadable(updatedOrderItems));
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
        setTimeout(function() { res.status(200).send(data); }, 1000);
      });
    } else {
      res.status(404).send({});
    }
  });

  crabmansCrabshackRouter.post('/payments', function(req, res) {
    var cardNumber = req.body.cardNumber;
    var securityCode = req.body.securityCode;
    var responseStatus;

    var cardDeclined = (Math.random() > 0.9) ? true : false;

    if (!cardNumber || !securityCode || cardNumber.length !== 16 || securityCode.length !== 3) {
      responseStatus = 400;
    } else if (cardDeclined) {
      responseStatus = 502;
    } else {
      responseStatus = 200;
    }

    setTimeout(function() {res.status(responseStatus).send({});}, 3000);
  });

  var _makeFoodStatesHumanReadable = function(order) {
    var humanReadableOrderItems = [];
    for (var i = 0; i < order.length; i++) {
      humanReadableOrderItems.push({id: order[i].id, state: FOOD_STATES[order[i].state]});
    }
    return {orderItems: humanReadableOrderItems, total: 0};
  };

  app.use('/api', crabmansCrabshackRouter);
};

