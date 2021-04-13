const db = require("../models");
const Chat = db.chat;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const chat = {
    idchat: req.body.idchat ? req.body.idchat : Math.random().toString(9).substring(2,7),
    mensaje: req.body.mensaje,
    usuario: req.body.usuario,
  };
  Chat.create(chat)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error creando chat"
      });
    });
};

exports.find = (req, res) => {
  const idchat = req.body.idchat;
  Chat.findByPk(idchat)
  .then(data => {
      res.send({data});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error recuperando chat con id ${idchat}`
      });
  });
};

exports.update = (req, res) => {
  const idchat = req.body.idchat;
  Chat.update(req.body, {
    where: { idchat: idchat }
  })
  .then(num => {
          res.send({ message: "chat actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el chat ${idchat}`
      });
  });
};

exports.delete = (req, res) => {
  const idchat = req.body.idchat;
  Chat.destroy({
    where: { idchat: idchat }
  })
  .then(num => {
          res.send({ status: "Eliminado" });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando el chat ${idchat}`
      });
  });
};

//Sin probar por si acaso
exports.deleteAll = (req, res) => {
  Chat.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} chats eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando chats."
      });
    });
};

exports.findAll = (req, res) => {
  Chat.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando chats."
      });
    });
};



