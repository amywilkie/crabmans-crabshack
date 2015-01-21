module.exports = function(app, store) {
  var express = require('express');
  var resetRouter = express.Router();

  resetRouter.get('/', function(req, res) {
    var NUMBER_OF_TABLES = 6;
    for (var i=1; i <= NUMBER_OF_TABLES; i++) {
      store[i] = [];
    }
    res.status(200).send({});
  });

  app.use('/api/reset', resetRouter);
};
