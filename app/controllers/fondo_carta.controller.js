const db = require("../models");
const Fondo_carta = db.fondo_carta;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const fondo_carta = {
      f_carta: req.body.f_carta,
    };
    res.send({message : "fondo_carta creado", fondo_carta});
  };
 
exports.findAll = (req, res) => {
    const fondo_carta = req.body.f_carta;
    res.send({message : "Se ha encontrado el fondo_carta", fondo_carta});
  };

exports.find = (req, res) => {
    const fondo_carta = req.body.f_carta;
    res.send({message : "Se ha encontrado el fondo_carta ", fondo_carta});
  };

exports.update = (req, res) => {
    const fondo_carta = req.body.f_carta;
    res.send({message : "Se ha actualizado el fondo_carta ", fondo_carta});
};

exports.delete = (req, res) => {
    const fondo_carta = req.body.f_carta;
    res.send({message : "Se ha eliminado el fondo_carta ", fondo_carta});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los fondo_cartas"});

  };