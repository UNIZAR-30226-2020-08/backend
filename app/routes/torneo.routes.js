module.exports = app => {
    const torneo = require("../controllers/torneo.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", torneo.create);

    router.get("/findTournament", torneo.find);

    router.delete("/dropTournament", torneo.delete);
  
    router.put("/updateTournament", torneo.update);
  
    app.use('/api/torneo', router);
  };