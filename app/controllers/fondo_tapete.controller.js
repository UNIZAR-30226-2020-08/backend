const db = require("../models");
const fondo_carta = require("../models/fondo_carta");
const fondo_tapete = require("../models/fondo_tapete");
const Fondo_tapete = db.fondo_tapete;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const fondo_tapete = {
      f_tapete: req.body.f_tapete,
    };
    
    Fondo_tapete.create(fondo_tapete)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando fondo_tapete"
        });
      });
  };
 

 
exports.findAll = (req, res) => {
    const fondo_tapete = req.body.f_tapete;

    var condition = fondo_tapete ? {fondo_tapete: { [Op.iLike]: `%${fondo_tapete}%` } } : null;
    Fondo_tapete.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando fondos_tapete."
        });
      });
  };
 

exports.find = (req, res) => {
    const f_tapete = req.body.f_tapete;

    Fondo_tapete.findByPk(f_tapete)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando fondo_tapete: " + f_tapete
        });
    });
  };
 

exports.update = (req, res) => {
    const fondo_tapete = req.body.f_tapete;

    Fondo_tapete.update(req.body, {
      where: { f_tapete: fondo_tapete }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "fondo_tapete actualizado."
          });
      } else {
          res.send({
              message: `No se puede actualizar el fondo_tapete: ${fondo_tapete}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando el fondo_tapete: " + fondo_tapete
      });
  });
};



exports.delete = (req, res) => {
    const fondo_tapete = req.body.f_tapete;

    Fondo_tapete.destroy({
      where: { f_tapete: fondo_tapete }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminada"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el tapete: ${fondo_tapete}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el tapete: " + fondo_tapete
        });
    });
};



exports.deleteAll = (req, res) => {

  Fondo_tapete.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} fondos_tapete eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando fondos_tapete."
      });
    });
};