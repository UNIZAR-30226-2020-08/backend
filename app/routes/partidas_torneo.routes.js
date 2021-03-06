module.exports = app => {
    const partidas_torneo = require("../controllers/partidas_torneo.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", partidas_torneo.create);

    router.get("/findTournamentGames", partidas_torneo.find);

    router.get("/findAllTournamentGames", partidas_torneo.findAll);

    router.delete("/dropTournamentGames", partidas_torneo.delete);

    router.delete("/dropAllTournamentGames", partidas_torneo.deleteAll);
  
    router.put("/updateTournamentGames", partidas_torneo.update);
  
    app.use('/api/partidas_torneo', router);
  };