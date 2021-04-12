const db = require("../models");
const TorneoPrivado = db.torneo_privado;
const Torneo = db.torneo;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

exports.create = (req, res) => {
  const alterName = Math.random().toString(36).substring(2,7);
  const torneo = {
    nombre: req.body.nombre ? req.body.nombre : alterName,
    tipo: req.body.tipo,
    nparticipantes: req.body.nparticipantes,
  };
  Torneo.create(torneo)
  .then(dataTorneo => {
    const torneo_privado = {
      nombre: req.body.nombre ? req.body.nombre : alterName,
      contrasenya: bcrypt.hashSync(req.body.contrasenya, 8),
    };
    TorneoPrivado.create(torneo_privado)
    .then(dataPrivado => {
      res.send({dataTorneo,dataPrivado});
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error creando torneo privado" });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error creando torneo" });
  });   
};

exports.find = (req, res) => {
  const nombre = req.body.nombre;
  TorneoPrivado.findByPk(nombre)
  .then(data => {
    Torneo.findByPk(nombre)
    .then(torneo => {
        res.send({torneo});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || `Error buscando el torneo ${nombre}`
        });
    });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error buscando el torneo privado ${nombre}`
      });
  });
};

exports.findAll = (req, res) => {
  TorneoPrivado.findAll({})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error recuperando torneos."
    });
  });
};

exports.update = (req, res) => {
  const passwd = req.body.contrasenya;
  const nombre = req.body.nombre;
  if (passwd !== null){
    req.body.contrasenya = bcrypt.hashSync(req.body.contrasenya, 8);
    TorneoPrivado.update(req.body, {
      where: { nombre: nombre }
    })
    .then(num => {
            res.send({ message: "Torneo privado actualizado." });
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || `Error actualizando el torneo ${nombre}`
        });
    });
  }
};

exports.delete = (req, res) => {
  const nombre = req.body.nombre;
  TorneoPrivado.destroy({
    where: { nombre: nombre }
  })
  .then(num => {
    Torneo.destroy({
      where: { nombre: nombre }
    })
    .then(num => {
            res.send({ status: "Eliminado" });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error eliminando el torneo ${nombre}`
        });
    });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando el torneo privado ${nombre}`
      });
  });
};

//Si se va a usar hay que poner que elimine de la tabla torneo
exports.deleteAll = (req, res) => {
  TorneoPrivado.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} torneos eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando torneos."
      });
    });
};