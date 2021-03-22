/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('torneo_privado', {
    'nombre': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'contrasenya': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'torneo_privado'
  });
};
