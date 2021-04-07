const db = require("../models");
const Pertenece = db.pertenece;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const pertenece = {
      jugador: req.body.jugador,
      partida: req.body.partida,
      equipo: req.body.equipo,
      c1: req.body.c1,
      c2: req.body.c2,
      c3: req.body.c3,
      c4: req.body.c4,
      c5: req.body.c5,
      c6: req.body.c6,

    };
    res.send({message : "pertenece creada", pertenece});
  };

exports.findAll = (req, res) => {
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha encontrado una pertenece", pertenece});
  };

exports.find = (req, res) => {
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha encontrado pertenece ", pertenece});
  };

exports.update = (req, res) => {
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha actualizado la pertenece ", pertenece});
};

exports.delete = (req, res) => {
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha eliminado la pertenece ", pertenece});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las pertenece"});
  };