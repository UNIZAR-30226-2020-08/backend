module.exports = app => {
    const foro = require("../controllers/foro.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", foro.create);

    router.get("/findForum", foro.find);

    router.get("/findAllForums", foro.findAll);

    router.delete("/dropForum", foro.delete);

    router.delete("/dropAllForums", foro.deleteAll);
  
    router.put("/updateForum", foro.update);
  
    app.use('/api/foro', router);
  };