var FOOD_STATES = require('../fixtures/food-states');
var menu = require('../fixtures/menu');
var _calculateTotal = function(order) {
  if (order.length === 0) {
    return "0.00";
  }
  var total = 0;

  order.forEach(function(item){
    var price = parseFloat(menu[item.id].price);
    total += price;
  });
  return total.toFixed(2).toString();
};

module.exports = function(order) {
  var humanReadableOrderItems = order.map(function(item) {
    return {id: item.id, state: FOOD_STATES[item.state]};
  });

  return {orderItems: humanReadableOrderItems, total: _calculateTotal(order)};
};

