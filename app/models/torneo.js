/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('torneo', {
    'nombre': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'tipo': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'nparticipantes': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'torneo'
  });
};
