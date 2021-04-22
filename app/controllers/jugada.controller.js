const e = require("express");
const db = require("../models");
const Jugada = db.jugada;
const Pertenece = db.pertenece;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const jugada = {
      jugador: req.body.jugador,
      nronda: req.body.nronda,
      partida: req.body.partida,
      carta: req.body.carta,
    };
    Jugada.create(jugada)
      .then(dataCreate => {
        Pertenece.findOne({where:{partida: jugada.partida, jugador:jugada.jugador}})
        .then(data => {
          const cards = ['c1','c2','c3','c4','c5','c6']
          for (card of cards){
            if (data[card] === jugada.carta){
              data[card] = 'NO'
            }
          }
          Pertenece.update(data.dataValues,{where: {partida: jugada.partida, jugador:jugada.jugador}})
          .then(num => {
            res.send({message: "Jugada almacenada", data});
          })
          .catch(err => {
            res.status(500).send({ message: err.message || "Error actualizando la mano." });
          });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error recuperando relcion pertenece" });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error guardando juagda" });
      });
  };

exports.findAll = (req, res) => {
    const partida = req.body.partida;
    var condition = partida ? { partida: { [Op.iLike]: `%${partida}%` } } : null;
  
    Jugada.findAll({ where: condition })
      .then(data => {
        if (data === null){
          res.send({message: 'No hay jugadas en esta partida'});
        }else{
          res.send(data);
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || `Error recuperando jugadas de la partida %${partida}%.`
        });
      });
  };
//DEVUELVE LA BAZA DE LA RONDA QUE SE LE PASA POR PARAMETRO
exports.find = (req, res) => {
    const partida = req.params.partida;
    const nronda = req.params.nronda;
    Jugada.findAll({ where: {partida: partida, nronda: nronda } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Error recuperando usuario con id: " + username });
    });
  };

exports.update = (req, res) => {
    const jugador = req.body.jugador;
    const partida = req.body.partida;
    const nronda = req.body.nronda;
    Jugada.update(req.body, {
      where: { jugador: jugador, partida: partida, nronda: nronda }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "jugada actualizada."
          });
      } else {
          res.send({
              message: `No se puede actualizar la juagda.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando la jugada"
      });
  });
};

exports.delete = (req, res) => {
  const jugador = req.body.jugador;
  const partida = req.body.partida;
  const nronda = req.body.nronda;
    Jugada.destroy({
      where: { jugador: jugador, partida: partida, nronda: nronda }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminada"
            });
        } else {
            res.send({
                status:  `No se puede eliminar la juagda.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando la juagda"
        });
    });
};

exports.deleteAll = (req, res) => {
  const partida = req.body.partida;
  Jugada.destroy({
    where: {partida: partida},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} jugadas eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Error eliminando jugadas de la partida %${partida}%.`
      });
    });
  };