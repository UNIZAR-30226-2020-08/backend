const db = require("../models");
const Customizable = db.customizable;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const customizable = {
      imagen: req.body.imagen,
    };
    
    Customizable.create(customizable)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando customizable"
        });
      });
  };

 
exports.findAll = (req, res) => {
  Customizable.findAll()
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error recuperando customizables."
    });
  });
};

exports.find = (req, res) => {
  const customizable = req.body.imagen;
  Customizable.findByPk(customizable)
  .then(data => {
      res.send({data});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error recuperando customizable: " + customizable
      });
  });
};
//NO SE VA A USAR
exports.update = (req, res) => {
  const customizable = req.body.imagen;
  Customizable.update(req.body, {
    where: { customizable: customizable }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "customizable actualizado."
          });
      } else {
          res.send({
              message: `No se puede actualizar el customizable: ${customizable}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando el customizable: " + customizable
      });
  });
};

exports.delete = (req, res) => {
  const imagen = req.body.imagen;
  Customizable.destroy({
    where: { imagen: imagen }
  })
  .then(num => {
          res.send({ status: "Eliminado" });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando el customizable:  ${imagen}.` });
  });
};
// FALTARIA ELIMIAR DE FONDO CARTA,TAPETE Y PERFIL
exports.deleteAll = (req, res) => {
  Customizable.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} customizable eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando customizables."
      });
    });
};

  