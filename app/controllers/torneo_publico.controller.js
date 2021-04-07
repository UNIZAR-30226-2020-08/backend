const db = require("../models");
const Torneo = db.torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const torneo = {
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      nparticipantes: req.body.nparticipantes,
    };
    res.send({message : "torneo creado", torneo});
  };

exports.findAll = (req, res) => {
    const torneo = req.body.torneo;
    res.send({message : "Se ha encontrado un torneo", torneo});
  };

exports.find = (req, res) => {
    const torneo = req.body.torneo;
    res.send({message : "Se ha encontrado el torneo ", torneo});
  };

exports.update = (req, res) => {
    const torneo = req.body.torneo;
    res.send({message : "Se ha actualizado el torneo ", torneo});
};

exports.delete = (req, res) => {
    const torneo = req.body.torneo;
    res.send({message : "Se ha eliminado el torneo ", torneo});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los torneo"});
  };