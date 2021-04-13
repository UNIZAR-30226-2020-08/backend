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

exports.findAll = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    var condition = pertenece_chat ? { pertence_chat: { [Op.iLike]: `%${pertence_chat}%` } } : null;
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

exports.find = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    PerteneceChat.findByPk(pertence_chat)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando pertenece_chat: " + pertence_chat
        });
    });
  };

exports.update = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    PerteneceChat.update(req.body, {
      where: { pertence_chat: pertence_chat }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "pertenece_chat actualizado."
          });
      } else {
          res.send({
              message: `No se puede actualizar pertenece_chat: ${pertence_chat}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando pertenece_chat: " + pertence_chat
      });
  });
};

exports.delete = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    PerteneceChat.destroy({
      where: { pertence_chat: pertence_chat }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar pertenece_chat: ${pertence_chat}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando pertenece_chat " + pertence_chat
        });
    });
};

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