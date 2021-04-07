module.exports = app => {
    const foto_perfil = require("../controllers/foto_perfil.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", foto_perfil.create);

    router.get("/findProfilePicture", foto_perfil.find);

    router.delete("/dropProfilePicture", foto_perfil.delete);
  
    router.put("/updateProfilePicture", foto_perfil.update);
  
    app.use('/api/foto_perfil', router);
  };