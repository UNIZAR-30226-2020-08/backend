/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customizable', {
    'imagen': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'customizable',
    timestamps: false
  });
};
