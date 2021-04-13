const db = require("../models");
const Fondo_carta = db.fondo_carta;
const Customizable = db.customizable;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const customizable = {
    imagen: req.body.f_carta,
  };
  Customizable.create(customizable)
      .then(dataCustom => {
        const fondo_carta = {
          f_carta: req.body.f_carta,
        };
        Fondo_carta.create(fondo_carta)
          .then(dataFCarta => {
            res.send({dataCustom,dataFCarta});
          })
          .catch(err => {
            res.status(500).send({message:err.message || "Error creando fondo_carta"});
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando customizable"
        });
      });
};

exports.find = (req, res) => {
    const f_carta = req.body.f_carta;
    Fondo_carta.findByPk(f_carta)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || `Error recuperando fondo_carta: ${f_carta}`
        });
    });
  };
// No se va a usar
exports.update = (req, res) => {
    const f_carta = req.body.f_carta;
    Fondo_carta.update(req.body, {
      where: { f_carta: f_carta }
  })
  .then(num => {
          res.send({message: "fondo_carta actualizado."});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el fondo_carta:  ${f_carta}`
      });
  });
};

exports.delete = (req, res) => {
    const f_carta = req.body.f_carta;
    Fondo_carta.destroy({
      where: { f_carta: f_carta }
    })
    .then(num => {
      Customizable.destroy({
        where: { imagen: f_carta }
      })
      .then(num => {
              res.send({ status: "Eliminado customizable" });
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || `Error eliminando el customizable:  ${f_carta}.` });
      });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error eliminando el fondo_carta ${f_carta}` 
        });
    });
};

exports.deleteAll = (req, res) => {
  Fondo_carta.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} fondo_cartas eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando fondo_carta."
      });
    });
};

exports.findAll = (req, res) => {
  Fondo_carta.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando fondos_carta."
      });
    });
};
