const db = require("../models");
const Fondo_tapete = db.fondo_tapete;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const fondo_tapete = {
      f_tapete: req.body.f_tapete,
    };
    res.send({message : "fondo_tapete creado", fondo_tapete});
  };
 
exports.findAll = (req, res) => {
    const fondo_tapete = req.body.f_tapete;
    res.send({message : "Se ha encontrado el fondo_tapete", fondo_tapete});
  };

exports.find = (req, res) => {
    const fondo_tapete = req.body.f_tapete;
    res.send({message : "Se ha encontrado el fondo_tapete ", fondo_tapete});
  };

exports.update = (req, res) => {
    const fondo_tapete = req.body.f_tapete;
    res.send({message : "Se ha actualizado el fondo_tapete ", fondo_tapete});
};

exports.delete = (req, res) => {
    const fondo_tapete = req.body.f_tapete;
    res.send({message : "Se ha eliminado el fondo_tapete ", fondo_tapete});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los fondo_tapetes"});

  };