/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('juega', {
    'jugador': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'nronda': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
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
    tableName: 'juega'
  });
};
