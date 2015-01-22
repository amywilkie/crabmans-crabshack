import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
        "crab": {description: "blah", type: "starter", price: "10.00"},
        "craab": {description: "blah", type: "main", price: "10.00"},
        "crablab": {description: "blah", type: "dessert", price: "10.00"},
        "craber": {description: "blah", type: "beverage", price: "10.00"},
    };
  }
});
