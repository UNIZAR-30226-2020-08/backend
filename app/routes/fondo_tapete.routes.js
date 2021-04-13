module.exports = app => {
    const fondo_tapete = require("../controllers/fondo_tapete.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", fondo_tapete.create);

    router.get("/findRugCard", fondo_tapete.find);

    router.get("/findAllRugsCard", fondo_tapete.findAll);

    router.delete("/dropRugCard", fondo_tapete.delete);

    router.delete("/dropAllRugsCard", fondo_tapete.deleteAll);
  
    router.put("/updateRugBack", fondo_tapete.update);
  
    app.use('/api/fondo_tapete', router);
  };