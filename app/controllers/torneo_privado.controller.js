const db = require("../models");
const TorneoPrivado = db.torneo_privado;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const torneo_privado = {
      nombre: req.body.nombre,
      contrasenya: req.body.contrasenya,
    };
    res.send({message : "torneo_privado creado", torneo_privado});
  };

exports.findAll = (req, res) => {
    const torneo_privado = req.body.torneo_privado;
    res.send({message : "Se ha encontrado un torneo_privado", torneo_privado});
  };

exports.find = (req, res) => {
    const torneo_privado = req.body.torneo_privado;
    res.send({message : "Se ha encontrado el torneo_privado ", torneo_privado});
  };

exports.update = (req, res) => {
    const torneo_privado = req.body.torneo_privado;
    res.send({message : "Se ha actualizado el torneo_privado ", torneo_privado});
};

exports.delete = (req, res) => {
    const torneo_privado = req.body.torneo_privado;
    res.send({message : "Se ha eliminado el torneo_privado ", torneo_privado});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los torneo_privados"});
  };