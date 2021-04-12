const db = require("../models");
const TorneoPublico = db.torneo_publico;
const Torneo = db.torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const alterName = Math.random().toString(36).substring(2,7);
  const torneo = {
    nombre: req.body.nombre ? req.body.nombre : alterName,
    tipo: req.body.tipo,
    nparticipantes: req.body.nparticipantes,
  };
  Torneo.create(torneo)
  .then(dataTorneo => {
    const torneo_publico = {
      nombre: req.body.nombre ? req.body.nombre : alterName
    }
    TorneoPublico.create(torneo_publico)
    .then(dataPublico => {
      res.send({dataTorneo,dataPublico});
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error creando torneo publico" });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error creando torneo" });
  });  
};

exports.find = (req, res) => {
  const nombre = req.body.nombre;
  TorneoPublico.findByPk(nombre)
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
              err.message || `Error buscando el torneo publico ${nombre}`
      });
  });
};

//Listar todos los torneos publicos
exports.findAll = (req, res) => {
  TorneoPublico.findAll({})
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
  TorneoPublico.destroy({
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
          message: err.message || `Error eliminando el torneo publico ${nombre}`
      });
  });
};
//Si se va a usar hay que poner que elimine de la tabla torneo
exports.deleteAll = (req, res) => {
  TorneoPublico.destroy({
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