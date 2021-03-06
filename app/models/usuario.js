/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario', {
    'username': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'password': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null"
    },
    'email': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null"
    },
    'copas': {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0',
      comment: "null"
    },
    'f_perfil': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'f_tapete': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'f_carta': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'usuario'
  });
};
