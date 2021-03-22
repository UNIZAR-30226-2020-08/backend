/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('torneo_publico', {
    'nombre': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'torneo_publico'
  });
};
