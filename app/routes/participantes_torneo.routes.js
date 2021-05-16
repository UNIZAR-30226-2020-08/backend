module.exports = app => {
    const participantes_torneo = require("../controllers/participantes_torneo.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", participantes_torneo.create);

    router.get("/findTournamentParticipants", participantes_torneo.find);

    router.get("/findAllTournamentParticipants", participantes_torneo.findAll);

    router.delete("/dropTournamentParticipants/:torneo/:jugador", participantes_torneo.delete);

    router.delete("/dropAllTournamentParticipants", participantes_torneo.deleteAll);
  
    router.put("/updateTournamentParticipants", participantes_torneo.update);
  
    app.use('/api/participantes_torneo', router);
  };