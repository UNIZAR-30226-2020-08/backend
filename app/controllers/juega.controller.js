const db = require("../models");
const Juega = db.juega;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const juega = {
      jugador: req.body.jugador,
      nronda: req.body.nronda,
      partida: req.body.partida,
      carta: req.body.carta,
    };
    res.send({message : "Juega creado", juega});
  };

exports.findAll = (req, res) => {
    const juega = req.body.juega;
    res.send({message : "Se ha encontrado juega", juega});
  };

exports.find = (req, res) => {
    const juega = req.body.juega;
    res.send({message : "Se ha encontrado juega ", juega});
  };

exports.update = (req, res) => {
    const juega = req.body.foto_perfil;
    res.send({message : "Se ha actualizado juega ", juega});
};

exports.delete = (req, res) => {
    const juega = req.body.juega;
    res.send({message : "Se ha eliminado juega ", juega});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las juega"});
  };