const db = require("../models");
const FotoPerfil = db.foto_perfil;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const foto_perfil = {
      f_perfil: req.body.f_perfil,
    };
    res.send({message : "foto_perfil creado", foto_perfil});
  };

exports.findAll = (req, res) => {
    const foto_perfil = req.body.foto_perfil;
    res.send({message : "Se ha encontrado la foto_perfil", foto_perfil});
  };

exports.find = (req, res) => {
    const foto_perfil = req.body.foto_perfil;
    res.send({message : "Se ha encontrado la foto_perfil ", foto_perfil});
  };

exports.update = (req, res) => {
    const foto_perfil = req.body.foto_perfil;
    res.send({message : "Se ha actualizado la foto_perfil ", foto_perfil});
};

exports.delete = (req, res) => {
    const foto_perfil = req.body.foto_perfil;
    res.send({message : "Se ha eliminado la foto_perfil ", foto_perfil});
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las foto_perfil"});
  };