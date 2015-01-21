var isValidTableNumber = require('../utils/is-valid-table-number');
var renderResponse = require('../utils/render-response');

module.exports = function(app, store) {
  var express = require('express');
  var tablesRouter = express.Router();

  tablesRouter.get('/:tableNumber', function(req, res) {
    var tableNumber = req.params.tableNumber;

      if (!isValidTableNumber(tableNumber)) {
        res.status(404).send({});
      }

      var currentOrderItems = store[tableNumber];
      var response = renderResponse(currentOrderItems);
      setTimeout(function() { res.status(200).send(response); }, 1000);
  });

  app.use('/api/tables', tablesRouter);
};
