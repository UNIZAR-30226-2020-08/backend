/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('foto_perfil', {
    'f_perfil': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'foto_perfil'
  });
};
