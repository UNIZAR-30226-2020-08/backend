const db = require("../models");
const CartaDisponible = db.carta_disponible;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const pertenece = {
      partida: req.body.partida,
      carta: req.body.carta
    };
    res.send({message : "pertenece creada", pertenece});
  };

exports.findAll = (req, res) => {
    const pertenece = req.body.partida;
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