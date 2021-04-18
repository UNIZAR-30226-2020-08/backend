module.exports = app => {
    const usuario = require("../controllers/usuario.controller.js");
  
    var router = require("express").Router();
  
    // Create a new usuario
    router.post("/", usuario.create);
  
    // Retrieve all published usuario
    //router.get("/findAll", usuario.findAll);
      
    // Buscar un usario
    router.get("/findUser/:username", usuario.find);

    // Eliminar un usuario
    router.delete("/dropUser", usuario.delete);
  
    // Eliminar todos usuario
    //router.delete("/dropAll", usuario.deleteAll);

    // Update a usuario with id
    router.put("/updateUser/:username", usuario.update);
  
    app.use('/api/usuario', router);
  };