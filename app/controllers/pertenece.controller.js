const db = require("../models");
const Pertenece = db.pertenece;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const pertenece = {
      jugador: req.body.jugador,
      partida: req.body.partida,
      equipo: req.body.equipo,
      c1: req.body.c1 ? req.body.c1 : 'No',
      c2: req.body.c2 ? req.body.c2 : 'No',
      c3: req.body.c3 ? req.body.c3 : 'No',
      c4: req.body.c4 ? req.body.c4 : 'No',
      c5: req.body.c5 ? req.body.c5 : 'No',
      c6: req.body.c6 ? req.body.c6 : 'No',

    };
    Pertenece.create(pertenece)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error creando usuario" });
      });
  };
// Devuelve todos los jugadores de la partida
exports.findAll = (req, res) => {
    const partida = req.body.partida;
    var condition = partida ? { partida: { [Op.iLike]: `%${partida}%` } } : null;
  
    Pertenece.findAll({ where: condition })
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
//USELESS
exports.find = (req, res) => {
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha encontrado pertenece ", pertenece});
  };

exports.update = (req, res) => {
  const partida = req.body.partida;
  const jugador = req.body.jugador;
  Pertenece.update(req.body, {
    where: { partida: partida, jugador: jugador }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "Se ha modificado pertenece"
          });
      } else {
          res.send({
              message: `No se puede actualizar pertenece.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando pertenece."
      });
  });
};

exports.delete = (req, res) => {
  const partida = req.body.partida;
  const jugador = req.body.jugador;
  Pertenece.destroy({
    where: { partida: partida, jugador: jugador }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              status: "Eliminado pertenece"
          });
      } else {
          res.send({
              status:  `No se puede eliminar pertenece.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error eliminando pertenece"
      });
  });
};
//Elimina todas las entradas de una partida 
exports.deleteAll = (req, res) => {
  const partida = req.body.partida;
  Pertenece.destroy({
    where: { partida: partida }
  })
  .then(num => {
    res.send({ status: `Eliminado ${partida}`});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error eliminando ${partida}`
      });
  });
  };