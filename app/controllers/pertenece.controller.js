const db = require("../models");
const pertenece = require("../models/pertenece");
const Pertenece = db.pertenece;
const Partida = db.partida;
const CartaDisponible = db.carta_disponible;
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
          equipo: (dataCount.length)%2,
          orden: dataCount.length + 1,
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
/** *
* Dados un jugador y una partida se le reparten las 6 cartas  
*/
exports.repartir = (req,res) =>{
  const partida = req.params.partida;
  const jugador = req.params.jugador;
  Partida.findByPk(partida)
  .then(dataPartida => {
    const pertenece = {
      jugador: jugador,
      partida: partida,
      c1: 'NO',
      c2: 'NO',
      c3: 'NO',
      c4: 'NO',
      c5: 'NO',
      c6: 'NO',
    };
    CartaDisponible.findAll({ where: {partida : partida} })
    .then(dataCD => {
      console.log(dataCD.length);
      console.log(dataPartida.triunfo);
      var card;
      var mano = ['','','','','',''];
      i = 0;
      while(i <= 5){
        place = ((Math.random().toString(9).substring(2,5)))%dataCD.length;
        card = dataCD[place].carta;
        if (card !== 'NO' && card !== mano[0] && card !== mano[1] && card !== mano[2] 
            && card !== mano[3] && card !== mano[4] && card !== mano[5] 
            && card !== dataPartida.triunfo){
          mano[i] = card;
          i++;
        }
      }
      console.log(mano);
      pertenece.c1 = mano[0];pertenece.c2 = mano[1];pertenece.c3 = mano[2];
      pertenece.c4 = mano[3];pertenece.c5 = mano[4];pertenece.c6 = mano[5];
      Pertenece.update(pertenece, {
        where: { partida: partida, jugador: jugador }
      })
      .then(num => {
        for (a of mano) {
          await CartaDisponible.destroy({
            where: { carta: a, partida: partida }
          })
          .then(num => {
                  console.log(`La carta ${a} ya no esta disponible`);
          })
          .catch(err => {
              res.status(500).send({
                  message: err.message || `Error eliminando la carta ${a}`
              });
          });
        }
       res.status(200).send(pertenece);
      })
      .catch(err => {
          res.status(500).send({ message: err.message || "Error actualizando pertenece." });
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando usuarios."
      });
    });
  
  })
  .catch(err => {
    res.status(500).send(`Error recuperando partida ${partida}`);
  });
};

exports.robar = (req,res) => {
  const partida = req.params.partida;
  const jugador = req.params.jugador;
  // Pasar como parametro la posicion que ha tirado c1,c2,c3... contando de izquierda a derecha
  const carta = req.params.carta;
  
  Partida.findByPk(partida)
  .then(dataPartida => {
    CartaDisponible.findAll({ where: {partida : partida} })
    .then(dataCD => {
      var card;
      if (dataCD.length > 2){
        do {
          place = ((Math.random().toString(9).substring(2,5)))%dataCD.length;
          card = dataCD[place].carta;
        }while(card === 'NO' | card === dataPartida.triunfo);
        var pertenece = selectCard(carta,jugador,partida,card);
        console.log(pertenece);
        //res.send(pertenece);
        CartaDisponible.destroy({
          where: { carta: card, partida: partida }
        })
        .then(num => {
          console.log(`La carta ${card} ya no esta disponible`);
          Pertenece.update(pertenece, {
            where: { partida: partida, jugador: jugador }
          })
          .then(num => {
                  res.send({ message: `Se ha robado la carta ${card}` });
          })
          .catch(err => {
              res.status(500).send({ message: err.message || "Error actualizando pertenece." });
          });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error eliminando la carta ${card}`});
        });
      }else{
        //Se reparte la carta que esta boca arriba
        var pertenece = selectCard(carta,jugador,partida,dataPartida.triunfo);
        console.log(pertenece);
        CartaDisponible.destroy({
          where: { carta: (dataPartida.triunfo), partida: partida }
        })
        .then(num => {
          console.log(`La carta ${dataPartida.triunfo} ya no esta disponible`);
          Pertenece.update(pertenece, {
            where: { partida: partida, jugador: jugador }
          })
          .then(num => {
                  res.send({ message: `Se ha robado la carta ${dataPartida.triunfo}` });
          })
          .catch(err => {
              res.status(500).send({ message: err.message || "Error actualizando pertenece." });
          });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error eliminando la carta ${dataPartida.triunfo}`});
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error recuperando usuarios." });
    });
    
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando partida " + partida });
  });
};


// Devuelve todos los jugadores de la partida
exports.findAll = (req, res) => {
  const partida = req.params.partida;

  Pertenece.findAll({where:{partida: partida}})
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

exports.find = (req, res) => {
  const juagdor = req.body.jugador;
  const partida = req.body.partida;
  Pertenece.findAll({where:{partida: partida, jugador:juagdor}})
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando relcion pertenece" });
  });
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
      res.status(500).send({ message: err.message || "Error actualizando pertenece." });
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

function selectCard(carta,jugador_,partida_,card_) {
  var pertenece;
    switch (carta){
      case 'c1':
        pertenece = {
          jugador: jugador_,
          partida: partida_,
          c1: card_
        };
        break;
      case 'c2':
        pertenece = {
          jugador: jugador_,
          partida: partida_,
          c2: card_
        };
        break;
      case 'c3':
        pertenece = {
          jugador: jugador_,
          partida: partida_,
          c3: card_
        };
        break;
      case 'c4':
        pertenece = {
          jugador: jugador_,
          partida: partida_,
          c4: card_
        };
        break;
      case 'c5':
        pertenece = {
          jugador: jugador_,
          partida: partida_,
          c5: card_
        };
        break;
      case 'c6':
        pertenece = {
          jugador: jugador_,
          partida: partida_,
          c6: card_
        };
        break;
    }
    return pertenece;
    
}