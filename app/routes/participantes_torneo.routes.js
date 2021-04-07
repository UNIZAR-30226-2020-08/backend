module.exports = app => {
    const participantes_torneo = require("../controllers/participantes_torneo.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", participantes_torneo.create);

    router.get("/findTournamentParticipants", participantes_torneo.find);

    router.delete("/dropTournamentParticipants", participantes_torneo.delete);
  
    router.put("/updateTournamentParticipants", participantes_torneo.update);
  
    app.use('/api/participantes_torneo', router);
  };