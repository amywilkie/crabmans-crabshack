import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
        "Prawn Cocktail": {description: "blah", type: "starter", price: "10.00"},
        "Claw of Crabulon": {description: "blah", type: "main", price: "10.00"},
        "Alcoholic milkshake": {description: "blah", type: "dessert", price: "10.00"},
        "craber": {description: "blah", type: "beverage", price: "10.00"},
    };
  }
});
