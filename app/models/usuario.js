const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario', {
    idusuario: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'usuario',
    schema: 'neob_main_schema',
    timestamps: false
    });
};