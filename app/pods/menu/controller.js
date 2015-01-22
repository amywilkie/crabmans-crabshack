import Em from 'ember';

var Promise = Em.RSVP.Promise;

export default Em.ObjectController.extend({
  itemsInBasket: Em.A([]),

  basket: Em.computed('itemsInBasket.[]', function() {
    var basket = this.get('itemsInBasket');

    var reducedItems = basket.reduce(function(previous, current) {
      if (previous[current.name]) {
         previous[current.name] += 1;
      } else {
        previous[current.name] = 1;
      }

      return previous;
    }, {});

    var result = Em.A([]);
    for (var prop in reducedItems) {
      if (reducedItems.hasOwnProperty(prop)) {
        result.pushObject({name: prop, count: reducedItems[prop]});
      }
    }

    return result;
  }),

  basketTotal: Em.computed('itemsInBasket.[]', function() {
    var basket = this.get('itemsInBasket');
    var total = 0;
    basket.forEach(function(item) {
      var price = parseFloat(item.price);
      total += price;
    });
    return total.toFixed(2);
  }),

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

  tableNumber: Em.computed(function() {
    return this.get('cookie').getCookie('tableNumber');
  }),

  actions: {
    addItem: function(item) {
      this.get('itemsInBasket').pushObject(item);
    },

    sendOrder: function() {
      var cookie = this.get('cookie');
      var tableNumber = cookie.getCookie('tableNumber');
      console.log('tableNumber', tableNumber);
      var orderItems = [];
      var basketItems = this.get('itemsInBasket');
      basketItems.forEach(function(item){
        orderItems.push(item.name);
      });

      var body = {
        tableNumber: tableNumber,
        orderItems: orderItems
      };

      Em.$.ajax({
        dataType: 'json',
        type: 'post',
        url: 'api/orders',
        data: body,
        success: function(data) {
          Em.run(function() {
            this.set('itemsInBasket', Em.A([]));
          }.bind(this));
          console.log(data);
        }.bind(this)
      });
      console.log(body);
    }
  }
});
