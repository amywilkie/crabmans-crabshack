module.exports = function(tableNumber) {
  var NUMBER_OF_TABLES = 6;
  if (!tableNumber || tableNumber < 1 || tableNumber > NUMBER_OF_TABLES) {
    return false;
  }
  return true;
}
