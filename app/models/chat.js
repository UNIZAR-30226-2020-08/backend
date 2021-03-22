/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chat', {
    'idchat': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'nextval(chat_idchat_seq::regclass)',
      comment: "null",
      primaryKey: true
    },
    'mensaje': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    },
    'usuario': {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'chat'
  });
};
