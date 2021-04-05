const db = require("../models");
const Customizable = db.customizable;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const customizable = {
      imagen: req.body.imagen,
    };
    res.send({message : "Customizable creado", customizable});
  };
 
exports.findAll = (req, res) => {
    const customizable = req.body.imagen;
    res.send({message : "Se ha encontrado el customizable", customizable});
  };

exports.find = (req, res) => {
    const customizable = req.body.imagen;
    res.send({message : "Se ha encontrado el customizable ", customizable});
  };

exports.update = (req, res) => {
    const customizable = req.body.imagen;
    res.send({message : "Se ha actualizado el customizable ", customizable});
};

exports.delete = (req, res) => {
    const customizable = req.body.imagen;
    res.send({message : "Se ha eliminado el customizable ", customizable});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los customizables"});

  };