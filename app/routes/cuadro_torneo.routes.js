module.exports = app => {
    const cuadro_torneo = require("../controllers/cuadro_torneo.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", cuadro_torneo.create);

    router.get("/findTournamentTable/:id_torneo", cuadro_torneo.find);

    router.get("/findAllTournamentTable/:id_torneo/:ronda", cuadro_torneo.findAll);

    router.delete("/dropTournamentTable/:id_torneo/:id_partida", cuadro_torneo.delete);

    router.delete("/dropAllTournamentTable", cuadro_torneo.deleteAll);
  
    router.put("/updateTournamentTable/:id_torneo/:id_partida", cuadro_torneo.update);
  
    app.use('/api/cuadro_torneo', router);
  };