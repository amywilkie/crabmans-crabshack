import Em from 'ember';

export default Em.ObjectController.extend({
  basket: [],

  menuItems: Em.computed('model', function() {
    var model = this.get('model');
    var items = [];

    if (model) {
      for (var prop in model) {
        if (model.hasOwnProperty(prop)) {
          var item = model[prop];
          item.name = prop;
          items.push(item);
        }
      }
    }

    return Em.A(items);
  }),

  starters: Em.computed('menutItems', function() {
    return this.get('menuItems').filterBy('type', 'starter');
  }),

  mains: Em.computed('menutItems', function() {
    return this.get('menuItems').filterBy('type', 'main');
  }),

  desserts: Em.computed('menutItems', function() {
    return this.get('menuItems').filterBy('type', 'dessert');
  }),

  beverages: Em.computed('menutItems', function() {
    return this.get('menuItems').filterBy('type', 'beverage');
  }),

  actions: {
    addItem: function(item) {
      this.basket.push(item);
      console.log(this.basket);
    }
  }
});
