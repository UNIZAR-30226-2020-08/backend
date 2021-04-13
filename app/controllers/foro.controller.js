const db = require("../models");
const Foro = db.foro;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const foro = {
      partida: req.body.partida,
      mensaje: req.body.mensaje,
    };
    Foro.create(foro)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error creando foro" });
      });
  };
 
exports.findAll = (req, res) => {
    const n_partida = req.body.partida;
    var condition = n_partida ? { n_partida: { [Op.iLike]: `%${n_partida}%` } } : null;
    Foro.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando foros."
        });
      });

  };
    

exports.find = (req, res) => {
    const partida = req.body.partida;
    Foro.findByPk(partida)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando foro: " + partida
        });
    });
  };

    
exports.update = (req, res) => {
    const n_partida = req.body.partida;
    Foro.update(req.body, {
      where: { partida: n_partida }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "Foro actualizado."
          });
      } else {
          res.send({
              message: `No se puede actualizar el foro : ${n_partida}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando foro : " + n_partida
      });
  });
};
    

exports.delete = (req, res) => {
    const n_partida = req.body.partida;
    Foro.destroy({
      where: { partida: n_partida }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el foro: ${n_partida}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el usuario con id: " + n_partida
        });
    });
};
    

exports.deleteAll = (req, res) => {
  Foro.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Foros eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando foros."
      });
    });
};