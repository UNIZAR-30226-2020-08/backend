const db = require("../models");
const pertenece = require("../models/pertenece");
const pertenece_chat = require("../models/pertenece_chat");
const PerteneceChat = db.pertenece_chat;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const pertence_chat = {
      usuario: req.body.usuario,
      idchat: req.body.idchat,
    };
    PerteneceChat.create(pertence_chat)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando pertenece_chat"
        });
      });
  };

exports.find = (req, res) => {
  const usuario = req.body.usuario;
  const idchat = req.body.idchat;
  PerteneceChat.findAll({
    where: { idchat: idchat, usuario:usuario }
  })
  .then(data => {
      res.send({data});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error recuperando pertenece_chat: ${idchat},${usuario}`
      });
  });
};

//no se va a usar, los dos clave primaria
exports.update = (req, res) => {
  const usuario = req.body.usuario;
  PerteneceChat.update(req.body, {
    where: { usuario: usuario }
  })
  .then(num => {
          res.send({ message: "chat actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el chat ${usuario}`
      });
  });
};

exports.delete = (req, res) => {
  const usuario = req.body.usuario;
  const idchat = req.body.idchat;
  PerteneceChat.destroy({
    where: { idchat: idchat, usuario:usuario }
  })
  .then(num => {
          res.send({ status: "Eliminado" });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando el chat ${idchat}, ${usuario}`
      });
  });
};

//no probamos por si acaso
exports.deleteAll = (req, res) => {
  PerteneceChat.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} pertenece_chats eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando pertenece_chats."
      });
    });
};

//Devuelve los usuarios pertenecientes al chat que se pasa
//REVISARRRR
exports.findAll = (req, res) => {
  const idchat = req.body.idchat;
  var condition = idchat ? { idchat: { [Op.iLike]: `${idchat}` } } : null;
  PerteneceChat.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando pertenece_chats."
      });
    });
};
