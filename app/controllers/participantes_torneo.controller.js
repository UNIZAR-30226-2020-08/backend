const db = require("../models");
const Participantes = db.participantes_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const participantes_torneo = {
      torneo: req.body.torneo,
      partida: req.body.partida,
    };
    Participantes.create(participantes_torneo)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando participantes_torneo"
        });
      });
  };

exports.findAll = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    var condition = participantes_torneo ? { participantes_torneo: { [Op.iLike]: `%${participantes_torneo}%` } } : null;
    Participantes.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando participantes_torneo."
        });
      });
  };

exports.find = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    Participantes.findByPk(participantes_torneo)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando participantes_torneo: " + participantes_torneo
        });
    });
  };

    

exports.update = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    Participantes.update(req.body, {
      where: { participantes_torneo: participantes_torneo }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "participante_torneo actualizado."
          });
      } else {
          res.send({
              message: `No se puede actualizar el participante_torneo: ${participantes_torneo}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando el participante_torneo: " + participantes_torneo
      });
  });
};

exports.delete = (req, res) => {
    const participantes_torneo = req.body.participantes_torneo;
    Participantes.destroy({
      where: { participantes_torneo: participantes_torneo }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el participante_torneo: ${participantes_torneo}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el participante_torneo: " + participantes_torneo
        });
    });
};
    
exports.deleteAll = (req, res) => {
  Participantes.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} participantes_torneo eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando participantes_torneo."
      });
    });
};