const db = require("../models");
const PertenceChat = db.pertence_chat;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const pertence_chat = {
      usuario: req.body.usuario,
      idchat: req.body.idchat,
    };
    res.send({message : "pertence_chat creada", pertence_chat});
  };

exports.findAll = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    res.send({message : "Se ha encontrado una pertence_chat", pertence_chat});
  };

exports.find = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    res.send({message : "Se ha encontrado pertence_chat ", pertence_chat});
  };

exports.update = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    res.send({message : "Se ha actualizado pertence_chat ", pertence_chat});
};

exports.delete = (req, res) => {
    const pertence_chat = req.body.pertence_chat;
    res.send({message : "Se ha eliminado pertence_chat ", pertence_chat});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas pertence_chat"});
  };