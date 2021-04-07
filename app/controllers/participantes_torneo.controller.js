const db = require("../models");
const Participantes = db.participantes_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const participantes_torneo = {
      torneo: req.body.torneo,
      partida: req.body.partida,
    };
    res.send({message : "participantes_torneo creado", participantes_torneo});
  };

exports.findAll = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    res.send({message : "Se ha encontrado participantes_torneo", participantes_torneo});
  };

exports.find = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    res.send({message : "Se ha encontrado participantes_torneo ", participantes_torneo});
  };

exports.update = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    res.send({message : "Se ha actualizado participantes_torneo ", participantes_torneo});
};

exports.delete = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    res.send({message : "Se ha eliminado participantes_torneo ", participantes_torneo});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas los participantes_torneo"});
  };