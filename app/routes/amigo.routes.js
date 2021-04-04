module.exports = app => {
    const amigo = require("../controllers/amigo.controller.js");
  
    var router = require("express").Router();
  
    // Create a new amigo
    router.post("/", amigo.create);
  
    // Retrieve all published amigo
    //router.get("/findAll", amigo.findAll);
      
    // Buscar un usario
    router.get("/findFriend", amigo.find);

    // Eliminar un amigo
    router.delete("/dropFriend", amigo.delete);
  
    // Eliminar todos amigo
    //router.delete("/dropAll", amigo.deleteAll);

    // Update a amigo with id
    router.put("/updateFriend", amigo.update);
  
    app.use('/api/amigo', router);
  };