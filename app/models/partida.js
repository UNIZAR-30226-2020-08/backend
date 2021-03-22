/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('partida', {
    'nombre': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'estado': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'tipo': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'fecha': {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'partida'
  });
};
