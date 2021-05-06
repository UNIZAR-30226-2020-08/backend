const db = require("../models");
const Torneo = db.torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const torneo = {
    nombre: req.body.nombre ? req.body.nombre : Math.random().toString(36).substring(2,7),
    tipo: req.body.tipo,
    nparticipantes: req.body.nparticipantes,
    contrasenya: req.body.contrasenya ? req.body.contrasenya : 'NO' 
  };
  Torneo.create(torneo)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error creando torneo" });
  });
};

exports.find = (req, res) => {
    const nombre = req.body.nombre;
    Torneo.findByPk(nombre)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || `Error bsucando el torneo ${nombre}`
        });
    });
  };

exports.update = (req, res) => {
  const nombre = req.body.nombre;
  Torneo.update(req.body, {
    where: { nombre: nombre }
  })
  .then(num => {
          res.send({ message: "usuario actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el torneo ${nombre}`
      });
  });
};

exports.delete = (req, res) => {
  const nombre = req.body.nombre;
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
};

exports.deleteAll = (req, res) => {
  Torneo.destroy({
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

exports.findAll = (req, res) => {
  Torneo.findAll({})
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