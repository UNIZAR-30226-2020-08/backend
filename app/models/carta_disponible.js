/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('carta_disponible', {
    'partida': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'carta': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'carta_disponible',
    timestamps: false
  });
};
