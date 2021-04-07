module.exports = app => {
    const foro = require("../controllers/foro.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", foro.create);

    router.get("/findForum", foro.find);

    router.delete("/dropForum", foro.delete);
  
    router.put("/updateForum", foro.update);
  
    app.use('/api/foro', router);
  };