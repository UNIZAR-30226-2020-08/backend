/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cuadro_torneo', {
    'id_torneo': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'id_partida': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'fase': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'eq_winner': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'cuadro_torneo'
  });
};
