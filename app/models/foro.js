/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('foro', {
    'partida': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'mensaje': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'jugador': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'foro'
  });
};
