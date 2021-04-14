const db = require("../models");
const Pertenece = db.pertenece;
const Partida = db.partida;
const Op = db.Sequelize.Op;

/**
 * Comprueba el tipo de partida y si la sala esta llena
 * si no esta llena inserta al jugador, si esta llena
 * devuelve un mensaje de aviso 
 **/
exports.create = (req, res) => {
  const partida = req.body.partida;
  Partida.findByPk(partida)
  .then(dataPartida => {
    Pertenece.findAll({where: { partida: partida}})
    .then(dataCount => {
      if (dataPartida.tipo === 0 && dataCount.length >= 2){
        res.send("Partida individual llena");
      }
      else if (dataPartida.tipo === 1 && dataCount.length >= 4){
        res.send("Partida dobles llena");
      }else{
        const pertenece = {
          jugador: req.body.jugador,
          partida: req.body.partida,
          equipo: req.body.equipo,
          c1: req.body.c1 ? req.body.c1 : 'NO',
          c2: req.body.c2 ? req.body.c2 : 'NO',
          c3: req.body.c3 ? req.body.c3 : 'NO',
          c4: req.body.c4 ? req.body.c4 : 'NO',
          c5: req.body.c5 ? req.body.c5 : 'NO',
          c6: req.body.c6 ? req.body.c6 : 'NO',
        };
        Pertenece.create(pertenece)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({ message: err.message || "Error creando usuario" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando usuarios."
      });
    });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando partida " + partida });
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

/**
 * Actualiza una sentyencia pertenece, se va a usar cada 
 * vez que un usuario robe o lance cualquier carta
**/
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