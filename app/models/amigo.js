/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('amigo', {
    'usuario': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'amigo': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'aceptado': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'amigo'
  });
};
