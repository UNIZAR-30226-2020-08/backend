/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pertenece', {
    'jugador': {
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
    },
    'equipo': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'c1': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'c2': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'c3': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'c4': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'c5': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'c6': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'orden': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'pertenece'
  });
};
