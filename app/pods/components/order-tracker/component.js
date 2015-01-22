import Ember from 'ember';
var Promise = Ember.RSVP.Promise;

export default Ember.Component.extend({
  items: Ember.A([]),

  didInsertElement: function() {
    this.poll();
  },

  poll: function() {
    console.log('poll()');
    this.data.apply(this)
    .then(function(items) {
      this.set('items', items);
      console.log("AAAAA", items);
    }.bind(this))
    .then(function() {
      console.log('BBBBB');
      Ember.run.later(function() {
        this.poll.apply(this);
      }.bind(this), 1000);//.bind(this);
    }.bind(this));
  },

  data: function() {
    var tableNumber = this.get('tableNumber');
    console.log('tableNumber:', tableNumber);
    return new Promise(function(resolve, reject) {
      Ember.$.ajax({
        url: 'api/tables/'+tableNumber,
        dataType: 'json',
        success: function(result) {
          console.log("table call successful");
          var orderItems = result['orderItems'];
          Ember.run(function() {
            console.log("orderItems", orderItems);
            resolve(orderItems);
          });
        }
      });
    });
  }
});
