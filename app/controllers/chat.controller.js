const db = require("../models");
const Chat = db.chat;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const chat = {
      idchat: req.body.idchat,
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
 
exports.findAll = (req, res) => {
    const chat = req.body.chat;
    
    var condition = chat ? { chat: { [Op.iLike]: `%${chat}%` } } : null;
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

exports.find = (req, res) => {
    const idchat = req.body.chat;

    Chat.findByPk(chat)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando chat con id: " + chat
        });
    });
  };

exports.update = (req, res) => {
    const chat = req.body.chat;
    Chat.update(req.body, {
      where: { idchat: chat }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "chat actualizado."
          });
      } else {
          res.send({
              message: `No se puede actualizar el chat con id: ${chat}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando chat con id: " + chat
      });
  });
};

exports.delete = (req, res) => {
    const chat = req.body.chat;
    Chat.destroy({
      where: { idchat: chat }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el chat con id: ${chat}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el chat con id: " + chat
        });
    });
};

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