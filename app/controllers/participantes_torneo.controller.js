const db = require("../models");
const Participantes = db.participantes_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const participantes_torneo = {
      torneo: req.body.torneo,
      jugador: req.body.jugador,
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
    const torneo = req.body.torneo;
    var condition = torneo ? { torneo: { [Op.iLike]: `%${torneo}%` } } : null;
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
  const torneo = req.body.torneo;
  const jugador = req.body.jugador;
  Participantes.findAll({
    where: { torneo:torneo, jugador:jugador }
  })
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error recuperando participantes_torneo: " + participantes_torneo
      });
  });
};
//No se va a usar
exports.update = (req, res) => {
  const torneo = req.body.torneo;
  const jugador = req.body.jugador;
  Participantes.update(req.body, {
    where: { torneo:torneo, jugador:jugador }
  })
  .then(num => {
          res.send({ message: "participante_torneo actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el participante_torneo: ${participantes_torneo}.`
      });
  });
};

exports.delete = (req, res) => {
  const torneo = req.body.torneo;
  const jugador = req.body.jugador;
  Participantes.destroy({
    where: { torneo:torneo, jugador:jugador }
  })
  .then(num => {
    res.send({status: "Eliminado"});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error eliminando el participante_torneo: " + participantes_torneo });
  });
};
//No se va a usar
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