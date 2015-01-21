var renderResponse = require('../utils/render-response');

module.exports = function(app, store) {
  var express = require('express');
  var tablesRouter = express.Router();

  tablesRouter.get('/:tableNumber', function(req, res) {
    var tableNumber = req.params.tableNumber;
    var table = store.getTable(tableNumber);

    if (!table) {
      res.status(404).send({});
    }

    var currentOrderItems = table;
    var response = renderResponse(currentOrderItems);
    setTimeout(function() { res.status(200).send(response); }, 1000);
  });

  app.use('/api/tables', tablesRouter);
};
