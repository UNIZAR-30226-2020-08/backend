const db = require("../models");
const Chat = db.chat;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const chat = {
      idchat: req.body.idchat,
      mensaje: req.body.mensaje,
      usuario: req.body.usuario,
    };
    res.send({message : "Usario creado", chat});
  };
 
exports.findAll = (req, res) => {
    const chat = req.body.chat;
    res.send({message : "Se ha encontrado el chat", chat});
  };

exports.find = (req, res) => {
    const chat = req.body.chat;
    res.send({message : "Se ha encontrado el chat ", chat});
  };

exports.update = (req, res) => {
    const chat = req.body.chat;
    res.send({message : "Se ha actualizado el chat ", chat});
};

exports.delete = (req, res) => {
    const chat = req.body.chat;
    res.send({message : "Se ha eliminado el chat ", chat});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los chats"});

  };