const db = require("../models");
const Partida = db.partida;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const partida = {
      nombre: req.body.nombre,
      estado: req.body.estado,
      tipo: req.body.tipo,
      fecha: req.body.fecha,
    };
    res.send({message : "partida creada", partida});
  };

exports.findAll = (req, res) => {
    const partida = req.body.partida;
    res.send({message : "Se ha encontrado una partida", partida});
  };

exports.find = (req, res) => {
    const partida = req.body.partida;
    res.send({message : "Se ha encontrado partida ", partida});
  };

exports.update = (req, res) => {
    const partida = req.body.partida;
    res.send({message : "Se ha actualizado la partida ", partida});
};

exports.delete = (req, res) => {
    const partida = req.body.partida;
    res.send({message : "Se ha eliminado la partida ", partida});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las partidas"});
  };