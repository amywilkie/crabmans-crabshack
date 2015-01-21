module.exports = function(app, store) {
  var express = require('express');
  var resetRouter = express.Router();

  resetRouter.get('/', function(req, res) {
    store.resetAllTables();
    res.status(200).send({});
  });

  app.use('/api/reset', resetRouter);
};
