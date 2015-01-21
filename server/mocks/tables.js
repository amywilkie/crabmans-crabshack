var renderResponse = require('../utils/render-response');
var FOOD_STATES = require('../fixtures/food-states');

function progressOrderState(table) {
  table.forEach(function(item) {
    var currentState = item.state;
    if (currentState < (FOOD_STATES.length - 1) && Math.random() > 0.5) {
      item.state++;
    }
  });
}

module.exports = function(app, store) {
  var express = require('express');
  var tablesRouter = express.Router();

  tablesRouter.get('/:tableNumber', function(req, res) {
    var tableNumber = req.params.tableNumber;
    var table = store.getTable(tableNumber);

    if (!table) {
      res.status(404).send({});
    }

    var response = renderResponse(table);
    progressOrderState(table);
    setTimeout(function() { res.status(200).send(response); }, 1000);
  });

  app.use('/api/tables', tablesRouter);
};
