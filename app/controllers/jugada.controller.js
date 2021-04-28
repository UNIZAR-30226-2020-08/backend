const e = require("express");
const db = require("../models");
const Jugada = db.jugada;
const Pertenece = db.pertenece;
const Partida = db.partida;
const Carta = db.carta;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  Jugada.findAll({where: { partida: req.body.partida, nronda: req.body.nronda}})
    .then(dataCount => {
      const jugada = {
        jugador: req.body.jugador,
        partida: req.body.partida,
        nronda: req.body.nronda,
        carta: req.body.carta,
        orden_tirada: dataCount.length + 1,
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
            
            res.send({cartaJugada: dataCreate, mano: data});
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
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error recuperando usuarios." });
    })
  };

exports.findAll = (req, res) => {
    const partida = req.body.partida;
  
    Jugada.findAll({ where: {partida: partida} })
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


exports.getRoundWinner = async (req, res) => {
  const partida = req.params.partida;
  const nronda = req.params.nronda;
  var maxPlays = 0;
  await Jugada.findAll({ where: {partida: partida, nronda: nronda } })
  .then(async dataOrder => {
    if(dataOrder.length !== 0){
      const dataPartida = await Partida.findByPk(partida);
      console.log(dataOrder, dataPartida.tipo);
      (dataPartida.tipo === 0) ? maxPlays = 2 : maxPlays = 4;
      var winnerCard = {jugador: dataOrder[0].jugador,carta: dataOrder[0].carta};
      var puntosMano = 0;
      for(o of dataOrder){
        const cartaJugada = await Carta.findByPk(o.carta);
        //Si coinciden los palos
        if(o.carta[1] === winnerCard.carta[1]){
          //Busco rankings
          const cartaWinner = await Carta.findByPk(winnerCard.carta);
          //Comparo rankings
          if(cartaJugada.ranking < cartaWinner.ranking){
            winnerCard = { jugador: o.jugador, carta: o.carta }
          }
        // Si la que tiras es triunfo y la otra no
        }else if ((o.carta[1] === dataPartida.triunfo[1]) && (winnerCard[1] !== dataPartida.triunfo[1])){
          winnerCard = { jugador: o.jugador, carta: o.carta }
        }
        puntosMano += cartaJugada.puntuacion;
      }
      
      //He calculado la carta ganadora y el total de puntos de la mano
      Pertenece.findOne({where:{partida: partida, jugador: winnerCard.jugador}})
      .then(dataWinner => {
        var team = '';
        if(dataWinner.equipo === 1){
          team = 'puntos_e1'; 
        }else if(dataWinner.equipo === 0){
          team = 'puntos_e0';
        }
        puntosMano += dataPartida[team];
        Partida.update({[team]: puntosMano}, {
          where: { nombre: partida }
        })
        .then(num => {
          if (num == 1) {
              res.send(winnerCard);
          }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || `Error actualizando la partida: ${partida}`});
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error recuperando relcion pertenece" });
      });
    }else{
      res.send('No hay jugadas en esta ronda');
    } 
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando usuario con id: " + username });
  });
};