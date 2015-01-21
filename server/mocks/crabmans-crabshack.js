module.exports = function(app, store) {
  var express = require('express');
  var crabmansCrabshackRouter = express.Router();
  var NUMBER_OF_TABLES = 6;
  var menu = require('../fixtures/menu');
  var FOOD_STATES = require('../fixtures/food-states');

  clearStore();

  var chaosFoodMonkey = setInterval(function() {
    for (var i = 1; i <= NUMBER_OF_TABLES; i++) {
      _randomlyProgressFoodOrdersForTable(i);
    }
  }, 10000);

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

  function clearStore() {
    for (var i=1; i <= NUMBER_OF_TABLES; i++) {
      store[i] = [];
    }
  }

  app.use('/api', crabmansCrabshackRouter);
};

