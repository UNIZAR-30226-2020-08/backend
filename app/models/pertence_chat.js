/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pertence_chat', {
    'usuario': {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "null",
      primaryKey: true
    },
    'idchat': {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "null",
      primaryKey: true
    }
  }, {
    tableName: 'pertence_chat'
  });
};
