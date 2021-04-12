const db = require("../models");
const Carta = db.carta;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const carta = {
      carta: req.body.carta,
      puntuacion: req.body.puntuacion,
    };
    Carta.create(carta)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando carta"
        });
      });
  };
 
exports.findAll = (req, res) => {
    const carta = req.body.carta;
    res.send({message : "Se ha encontrado la carta", carta});
  };

exports.find = (req, res) => {
    const carta = req.body.carta;
    res.send({message : "Se ha encontrado la carta ", carta});
  };

exports.update = (req, res) => {
    const carta = req.body.carta;
    res.send({message : "Se ha actualizado la carta ", carta});
};

exports.delete = (req, res) => {
    const carta = req.body.carta;
    res.send({message : "Se ha eliminado la carta ", carta});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los cartas"});

  };