function _isValidCard(cardNumber, securityCode) {
  if (!cardNumber || !securityCode || cardNumber.length !== 16 || securityCode.length !== 3) {
    return false;
  }
  return true;
}

module.exports = function(app, store) {
  var express = require('express');
  var paymentsRouter = express.Router();

  paymentsRouter.post('/', function(req, res) {
    var cardNumber = req.body.cardNumber;
    var securityCode = req.body.securityCode;
    var tableNumber = req.body.tableNumber;
    var cardDeclined = (Math.random() > 0.9) ? true : false;

    if (!store.getTable(tableNumber) || !_isValidCard(cardNumber, securityCode)) {
      res.status(400).send({});
    } else if (cardDeclined) {
      setTimeout(function() {res.status(502).send({});}, 3000);
    } else {
      store.resetTable(tableNumber);
      setTimeout(function() {res.status(200).send({});}, 3000);
    }
  });

  app.use('/api/payments', paymentsRouter);
};
