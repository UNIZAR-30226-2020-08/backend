const db = require("../models");
const CartaDisponible = db.carta_disponible;
const Carta = db.carta;
const Op = db.Sequelize.Op;
/**
 * Se instancia al crear una partida e inserta toda la baraja a
 * la tabla ya que al iniciar la partida la baraja esta completa
**/
exports.create = (req, res) => {
  Carta.findAll()
    .then(data => {
      for (card of data)
      {
        const carta_disponible = {
          partida: req.body.partida,
          carta: card.carta
        };
        CartaDisponible.create(carta_disponible)
        .then(data => {
          console.log(`Se ha insertado el ${data.carta}`);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Error creando carta_disponible"
          });
        });
      }
      res.send(200);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando cartas."
      });
    });
    
    
};
/**
* Devuelve todas las cartas disponibles en una partida
**/
exports.findAll = (req, res) => {
    const partida = req.body.partida;  
    CartaDisponible.findAll({ where:{partida : partida} })
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
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha encontrado pertenece ", pertenece});
  };

exports.update = (req, res) => {
    const pertenece = req.body.pertenece;
    res.send({message : "Se ha actualizado la pertenece ", pertenece});
};

exports.delete = (req, res) => {
  const carta = req.body.carta;
  const partida = req.body.partida;
  CartaDisponible.destroy({
    where: { carta: carta, partida: partida }
  })
  .then(num => {
          res.send({ status: `La carta ${carta} ya no esta disponible` });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando la carta ${carta}`
      });
  });
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las pertenece"});
  };