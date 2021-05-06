/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('partida', {
    'nombre': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'triunfo': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
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
    },
    'o_20': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'NO',
      comment: "null"
    },
    'c_20': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'NO',
      comment: "null"
    },
    'b_20': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'NO',
      comment: "null"
    },
    'e_20': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'NO',
      comment: "null"
    },
    'password': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'puntos_e0': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'puntos_e1': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'id_torneo': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'partida'
  });
};
