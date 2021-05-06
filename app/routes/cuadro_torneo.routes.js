module.exports = app => {
    const participantes_torneo = require("../controllers/cuadro_torneo.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", cuadro_torneo.create);

    router.get("/findTournamentTable", cuadro_torneo.find);

    router.get("/findAllTournamentTable", cuadro_torneo.findAll);

    router.delete("/dropTournamentTable", cuadro_torneo.delete);

    router.delete("/dropAllTournamentTable", cuadro_torneo.deleteAll);
  
    router.put("/updateTournamentTable", cuadro_torneo.update);
  
    app.use('/api/cuadro_torneo', router);
  };