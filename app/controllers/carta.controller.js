const db = require("../models");
const Carta = db.carta;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const carta = {
      carta: req.body.carta,
      puntuacion: req.body.puntuacion,
    };
    Carta.create(carta)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando carta"
        });
      });
  };
 
exports.findAll = (req, res) => {
  Carta.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando cartas."
      });
    });
};

exports.find = (req, res) => {
    const carta = req.body.carta;
    Carta.findByPk(carta)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando carta: " + carta
        });
    });
  };

exports.update = (req, res) => {
    const carta = req.body.carta;
    
    Carta.update(req.body, {
      where: { carta: carta }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "carta actualizada."
          });
      } else {
          res.send({
              message: `No se puede actualizar la carta: ${carta}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando la carta: " + carta
      });
  });
};


exports.delete = (req, res) => {
    const carta = req.body.carta;
    
    Carta.destroy({
      where: { carta: carta }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminada"
            });
        } else {
            res.send({
                status:  `No se puede eliminar la carta: ${carta}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando la carta: " + carta
        });
    });
};


exports.deleteAll = (req, res) => {
  Carta.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} cartas eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando cartas."
      });
    });
};