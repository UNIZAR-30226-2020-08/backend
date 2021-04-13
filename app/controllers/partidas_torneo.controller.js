const db = require("../models");
const partida = require("../models/partida");
const PartidaTorneo = db.partidas_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const partidas_torneo = {
      torneo: req.body.torneo,
      partida: req.body.partida,
    };
    PartidaTorneo.create(partidas_torneo)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando partida_torneo"
        });
      });
  };
    

exports.findAll = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    var condition = partidas_torneo ? { partidas_torneo: { [Op.iLike]: `%${partidas_torneo}%` } } : null;
    PartidaTorneo.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando partidas_torneo."
        });
      });
  };
    

exports.find = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    PartidaTorneo.findByPk(partidas_torneo)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando partida_torneo: " + partidas_torneo
        });
    });
  };
    

exports.update = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    PartidaTorneo.update(req.body, {
      where: { partidas_torneo: partidas_torneo }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "partida_torneo actualizada."
          });
      } else {
          res.send({
              message: `No se puede actualizar la partida_torneo: ${partidas_torneo}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando la partidas_torneo: " + partidas_torneo
      });
  });
};

exports.delete = (req, res) => {
    const partidas_torneo = req.body.partidas_torneo;
    PartidaTorneo.destroy({
      where: { partidas_torneo: partidas_torneo }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminada"
            });
        } else {
            res.send({
                status:  `No se puede eliminar la partida_torneo: ${partidas_torneo}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando la partida_torneo: " + partidas_torneo
        });
    });
};

exports.deleteAll = (req, res) => {
  PartidaTorneo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} partidas_torneo eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando partidas_torneo."
      });
    });
};