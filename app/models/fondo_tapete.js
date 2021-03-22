/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fondo_tapete', {
    'f_tapete': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'fondo_tapete'
  });
};
