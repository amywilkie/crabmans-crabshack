module.exports = function(app) {
  var express = require('express');
  var crabmansCrabshackRouter = express.Router();
  var NUMBER_OF_TABLES=6;

  crabmansCrabshackRouter.get('/menu', function(req, res) {
    var response = [
      {
        id: 1,
        name: 'Prawn Cocktail',
        type: 'starter',
        description: 'A modern starter for the modern man',
        price: '3.99'
      },
      {
        id: 2,
        name: 'Claw of Crabulon',
        type: 'main',
        description: 'Keep calm and Crabulon',
        price: '12.85'
      },
      {
        id: 3,
        name: 'Crabman Sundae',
        type: 'dessert',
        description: 'Ground up crabs with animal fat ice cream. A variety of sauces available.',
        price: '4.90'
      },
      {
        id: 4,
        name: 'Alcoholic milkshake',
        type: 'beverage',
        description: 'The best alcoholic milkshake you will taste this side of the Atlantic.',
        price: '3.99'
      }
    ];
    var responseStatus = 200;

    setTimeout(function() { res.status(responseStatus).send(response); }, 1000);

  });

  crabmansCrabshackRouter.post('/orders', function(req, res) {
    var tableNumber = req.body.tableNumber;
    var responseStatus;

    if (tableNumber && tableNumber > 0 && tableNumber <= NUMBER_OF_TABLES) {
      responseStatus = 201;
    } else {
      responseStatus = 404;
    }

    setTimeout(function() {res.status(responseStatus ).send({});}, 1000);
  });

  app.use('/api', crabmansCrabshackRouter);

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
};

