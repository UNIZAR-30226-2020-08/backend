const db = require("../models");
const PartidaTorneo = db.partidas_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const partidas_torneo = {
      torneo: req.body.torneo,
      partida: req.body.partida,
    };
    res.send({message : "partidas_torneo creada", partidas_torneo});
  };

exports.findAll = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    res.send({message : "Se ha encontrado una partidas_torneo", partidas_torneo});
  };

exports.find = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    res.send({message : "Se ha encontrado partidas_torneo ", partidas_torneo});
  };

exports.update = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    res.send({message : "Se ha actualizado la partidas_torneo ", partidas_torneo});
};

exports.delete = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    res.send({message : "Se ha eliminado la partidas_torneo ", partidas_torneo});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las partidas_torneo"});
  };