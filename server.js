const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();
//Por si hace falta hacer drop y resincronizar la base 
/*db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});*/
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Prueba del server de backend de las10ultimas" });
});
require("./app/routes/amigo.routes")(app);
require("./app/routes/carta_disponible.routes")(app);
require("./app/routes/carta.routes")(app);
require("./app/routes/chat.routes")(app);
require("./app/routes/customizable.routes")(app);
require("./app/routes/fondo_carta.routes")(app);
require("./app/routes/fondo_tapete.routes")(app);
require("./app/routes/foro.routes")(app);
require("./app/routes/foto_perfil.routes")(app);
require("./app/routes/jugada.routes")(app);
require("./app/routes/participantes_torneo.routes")(app);
require("./app/routes/partida.routes")(app);
require("./app/routes/partidas_torneo.routes")(app);
require("./app/routes/pertenece_chat.routes")(app);
require("./app/routes/pertenece.routes")(app);
require("./app/routes/torneo_privado.routes")(app);
require("./app/routes/torneo_publico.routes")(app);
require("./app/routes/torneo.routes")(app);
require("./app/routes/usuario.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});