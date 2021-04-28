/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('carta', {
    'carta': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'puntuacion': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    },
    'ranking': {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'carta'
  });
};
