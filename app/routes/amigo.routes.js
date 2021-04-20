module.exports = app => {
    const amigo = require("../controllers/amigo.controller.js");
  
    var router = require("express").Router();
  
    /** 
    * Dado dos usuarios crea la relacion amigo 
    **/
    router.post("/", amigo.create);
  
    // Dado un usario devuelve todos sus amigos.
    router.get("/findAll/:usuario", amigo.findAll);
      
    // Buscar un usario
    router.get("/findFriend", amigo.findAll);

    // Eliminar un amigo
    router.delete("/dropFriend", amigo.delete);
  
    // Eliminar todos amigo
    router.delete("/dropAll", amigo.deleteAll);

    // Update a amigo with id el que sea 
    router.put("/updateFriend/:usuario/:amigo", amigo.update);

    router.put("/acceptFriend/:usuario/:amigo", amigo.aceptar);
  
    app.use('/api/amigo', router);
  };