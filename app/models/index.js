const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  schema: dbConfig.SCHEMA,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  define:{
    timestamps: false
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.amigo = require("./amigo.js")(sequelize, Sequelize);
db.carta_disponible = require("./carta_disponible.js")(sequelize, Sequelize);
db.carta = require("./carta.js")(sequelize, Sequelize);
db.chat = require("./chat.js")(sequelize, Sequelize);
db.cuadro_torneo = require("./cuadro_torneo.js")(sequelize, Sequelize);
db.customizable = require("./customizable.js")(sequelize, Sequelize);
db.fondo_carta = require("./fondo_carta.js")(sequelize, Sequelize);
db.fondo_tapete = require("./fondo_tapete.js")(sequelize, Sequelize);
db.foro = require("./foro.js")(sequelize, Sequelize);
db.foto_perfil = require("./foto_perfil.js")(sequelize, Sequelize);
db.jugada = require("./jugada.js")(sequelize, Sequelize);
db.participantes_torneo = require("./participantes_torneo.js")(sequelize, Sequelize);
db.partida = require("./partida.js")(sequelize, Sequelize);
db.partidas_torneo = require("./partidas_torneo.js")(sequelize, Sequelize);
db.pertenece_chat = require("./pertenece_chat.js")(sequelize, Sequelize);
db.pertenece = require("./pertenece.js")(sequelize, Sequelize);
db.torneo_privado = require("./torneo_privado.js")(sequelize, Sequelize);
db.torneo_publico = require("./torneo_publico.js")(sequelize, Sequelize);
db.torneo = require("./torneo.js")(sequelize, Sequelize);
db.usuario = require("./usuario.js")(sequelize, Sequelize);

module.exports = db;