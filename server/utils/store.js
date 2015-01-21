function Store() {
  this.data = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  };
}

Store.prototype.getTable = function(id) {
  return this.data[id];
}

Store.prototype.addItemToTable = function(id, item) {
  this.getTable(id).push(item);
}

Store.prototype.resetTable = function(id) {
  this.data[id] = [];
}

Store.prototype.resetAllTables = function() {
  for(var id in this.data) {
    this.resetTable(id);
  }
}

module.exports = Store;
