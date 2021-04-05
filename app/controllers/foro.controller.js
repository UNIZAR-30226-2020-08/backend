const db = require("../models");
const Foro = db.foro;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const foro = {
      partida: req.body.partida,
      mensaje: req.body.mensaje,
    };
    res.send({message : "Usario creado", foro});
  };
 
exports.findAll = (req, res) => {
    const foro = req.body.foro;
    res.send({message : "Se ha encontrado el foro", foro});
  };

exports.find = (req, res) => {
    const foro = req.body.foro;
    res.send({message : "Se ha encontrado el foro ", foro});
  };

exports.update = (req, res) => {
    const foro = req.body.foro;
    res.send({message : "Se ha actualizado el foro ", foro});
};

exports.delete = (req, res) => {
    const foro = req.body.foro;
    res.send({message : "Se ha eliminado el foro ", foro});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los foros"});

  };