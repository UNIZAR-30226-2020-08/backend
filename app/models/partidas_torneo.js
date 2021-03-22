/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('partidas_torneo', {
    'torneo': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'partida': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'partidas_torneo'
  });
};
