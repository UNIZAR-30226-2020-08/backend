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
    const partida = req.params.partida;
  
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
exports.prevRoundWinnerIA = async (req, res) => {
  const partida = req.params.partida;
  const nronda = req.params.nronda;
  console.log('LO QUE ME PASAS A PREVROUNDIA: ',req.params)
  await Jugada.findAll({ where: {partida: partida, nronda: nronda }})
  .then(async dataOrder => {
    //Ordena por orden de tirada
    dataOrder.sort(function (a,b) {
      if (a.orden > b.orden){
        return 1;
      }
      if (a.orden < b.orden) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    if(dataOrder.length !== 0){
      const dataPartida = await Partida.findByPk(partida);
      //console.log('Jugadas de la partida ',dataOrder);
      //var maxPlays = (dataPartida.tipo + 1)*2;
      var winnerCard = {jugador: dataOrder[0].jugador,carta: dataOrder[0].carta};
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
        }else if ((o.carta[1] === dataPartida.triunfo[1]) && (winnerCard.carta[1] !== dataPartida.triunfo[1])){
          winnerCard = { jugador: o.jugador, carta: o.carta }
        }
      }
      console.log('EL GANADOR DE LA RONDA ANTERIOR IA: ', winnerCard)
      res.status(200).send(winnerCard)
    }else{
      res.send('No hay jugadas en esta ronda');
    } 
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando usuario con id: " + username });
  });
      
}

exports.getRoundWinner = async (req, res) => {
  const partida = req.params.partida;
  const nronda = req.params.nronda;
  console.log('EL BODY DE getRoundWinner: ', req.params)
  await Jugada.findAll({ where: {partida: partida, nronda: nronda } })
  .then(async dataOrder => {
     //Ordena por orden de tirada
     dataOrder.sort(function (a,b) {
      if (a.orden > b.orden){
        return 1;
      }
      if (a.orden < b.orden) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    console.log('EL ORDEN', dataOrder)
    if(dataOrder.length !== 0){
      const dataPartida = await Partida.findByPk(partida);
      //console.log('Jugadas de la partida ',dataOrder);
      //var maxPlays = (dataPartida.tipo + 1)*2;
      var winnerCard = {jugador: dataOrder[0].jugador,carta: dataOrder[0].carta};
      var puntosMano = 0;
      for(o of dataOrder){
        const cartaJugada = await Carta.findByPk(o.carta);
        console.log('CARTA JUGADA', cartaJugada)
        //Si coinciden los palos
        if(o.carta[1] === winnerCard.carta[1]){
          //Busco rankings
          const cartaWinner = await Carta.findByPk(winnerCard.carta);
          console.log('CARTA WINNER', cartaWinner)
          //Comparo rankings
          if(cartaJugada.ranking < cartaWinner.ranking){
            winnerCard = { jugador: o.jugador, carta: o.carta }
          }
        // Si la que tiras es triunfo y la otra no
        }else if ((o.carta[1] === dataPartida.triunfo[1]) && (winnerCard.carta[1] !== dataPartida.triunfo[1])){
          winnerCard = { jugador: o.jugador, carta: o.carta }
        }
        puntosMano += cartaJugada.puntuacion;
      }
      
      //He calculado la carta ganadora y el total de puntos de la mano
      await Pertenece.findOne({where:{partida: partida, jugador: winnerCard.jugador}})
      .then(async dataWinner => {
        var team = '';
        if(dataWinner.equipo === 1){
          team = 'puntos_e1'; 
        }else if(dataWinner.equipo === 0){
          team = 'puntos_e0';
        }
        if ((dataPartida.tipo == 0) && (nronda == 19)){
          console.log('se cuentan las 10 ultimas en individual')
          puntosMano += 10;
        }else if ((dataPartida.tipo == 1) && (nronda == 9)){
          console.log('se cuentan las 10 ultimas en parejas')
          puntosMano += 10;
        }
        puntosMano += dataPartida[team];
        await Partida.update({[team]: puntosMano}, {
          where: { nombre: partida }
        })
        .then(num => {
              console.log('EL GANADOR DE LA RONDA: ',winnerCard)
              res.send(winnerCard);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || `Error actualizando la partida: ${partida}`});
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error recuperando relcion pertenece" });
      });
    }else{
      res.status(200).send({mensaje: 'No hay jugadas en esta ronda'});
    } 
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando usuario con id: " + username });
  });
};
// Devuelve el orden en el que se ha quedado en la ronda.
exports.getRoundOrder = async (req, res) => {
  const partida = req.params.partida;
  const nronda = req.params.nronda;
  var maxPlays = 0;
  var sol = [];
  try {
    const dataOrder = await Jugada.findAll({ where: {partida: partida, nronda: nronda }})
    //return res.send(dataOrder);
    if(dataOrder.length !== 0){
      const dataPartida = await Partida.findByPk(partida);
      (dataPartida.tipo === 0) ? maxPlays = 2 : maxPlays = 4;
      var winnerCard = {jugador: dataOrder[0].jugador,carta: dataOrder[0].carta};
      var i = 0;
      var indexWinner = 0;
      for(o of dataOrder){
        const cartaJugada = await Carta.findByPk(o.carta);
        //Si coinciden los palos
        if(o.carta[1] === winnerCard.carta[1]){
          //Busco rankings
          const cartaWinner = await Carta.findByPk(winnerCard.carta);
          //Comparo rankings
          if(cartaJugada.ranking < cartaWinner.ranking){
            indexWinner = i;
          }
        // Si la que tiras es triunfo y la otra no
        }else if ((o.carta[1] === dataPartida.triunfo[1]) && 
                  (winnerCard[1] !== dataPartida.triunfo[1])){
          indexWinner = i;
        }
        i++;
      }
      for (j = indexWinner; j < (indexWinner + maxPlays); j++){
        sol.push(dataOrder[j%maxPlays].jugador);
      }
      return res.status(200).send(sol);
    }else{
      res.sendStatus(404).send('No se ha encontrado la ronda o la partida')
    }
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error'});
  }
    
};

exports.getLastRoundPayed = async (req, res) => {
  try{
    const partida = req.params.partida;
    const dataJuadas = await Jugada.findAll({ where: {partida: partida}})
    //Ordena por orden descendente de copas
    dataJuadas.sort(function (a,b) {
      if (a.nronda > b.nronda){
        return 1;
      }
      if (a.nronda < b.nronda) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    const lastRound = (dataJuadas.pop()).nronda
    console.log('ULTIMA RONDA', lastRound)
    res.status(200).send({nronda: lastRound})
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error buscando la ultima ronda'})
  }
};
