const db = require("../models");
const CartaDisponible = db.carta_disponible;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const carta_disponible = {
      partida: req.body.partida,
      carta: req.body.carta
    };
    CartaDisponible.create(carta_disponible)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando carta_disponible"
        });
      });
  };

exports.findAll = (req, res) => {
    const partida = req.body.partida;
    const carta = req.body.carta;
    var condition = carta ? { partida: { [Op.iLike]: `%${partida}%` } } : null;
  
    Usuario.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando usuarios."
        });
      });
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