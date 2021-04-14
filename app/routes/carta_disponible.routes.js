module.exports = app => {
    const cartaDisponible = require("../controllers/carta_disponible.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", cartaDisponible.create);

    router.get("/findACard", cartaDisponible.find);
    
    router.get("/findAllACard", cartaDisponible.findAll);

    router.delete("/dropACard", cartaDisponible.delete);
  
    router.put("/updateACard", cartaDisponible.update);
  
    app.use('/api/cartaDisponible', router);
  };