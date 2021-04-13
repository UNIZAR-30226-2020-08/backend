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
    const customizable = req.body.imagen;
    
    //var condition = customizable ? { customizable: { [Op.iLike]: `%${customizable}%` } } : null;
      Carta.findAll({ /*where: condition*/ })
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
    const customizable = req.body.imagen;
    
    Customizable.destroy({
      where: { customizable: customizable }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el customizable: ${customizable}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el customizable: " + customizable
        });
    });
};

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

  