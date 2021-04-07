const db = require("../models");
const TorneoPublico = db.torneo_publico;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const torneo_publico = {
      nombre: req.body.nombre,
    };
    res.send({message : "torneo_publico creado", torneo_publico});
  };

exports.findAll = (req, res) => {
    const torneo_publico = req.body.torneo_publico;
    res.send({message : "Se ha encontrado un torneo_publico", torneo_publico});
  };

exports.find = (req, res) => {
    const torneo_publico = req.body.torneo_publico;
    res.send({message : "Se ha encontrado el torneo_publico ", torneo_publico});
  };

exports.update = (req, res) => {
    const torneo_publico = req.body.torneo_publico;
    res.send({message : "Se ha actualizado el torneo_publico ", torneo_publico});
};

exports.delete = (req, res) => {
    const torneo_publico = req.body.torneo_publico;
    res.send({message : "Se ha eliminado el torneo_publico ", torneo_publico});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los torneo_publicos"});
  };