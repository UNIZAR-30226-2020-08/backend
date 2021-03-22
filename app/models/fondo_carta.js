/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fondo_carta', {
    'f_carta': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'fondo_carta'
  });
};
