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
    const torneo = req.body.torneo;
    var condition = torneo ? { torneo: { [Op.iLike]: `%${torneo}%` } } : null;
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
  const torneo = req.body.torneo;
  const partida = req.body.partida;
  PartidaTorneo.findAll({
    where: { torneo:torneo, partida:partida }
  })
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error recuperando partida_torneo: ${torneo},${partida}`
      });
  });
};
    
//No se va a usar
exports.update = (req, res) => {
  const torneo = req.body.torneo;
  const partida = req.body.partida;
  PartidaTorneo.update(req.body, {
    where: { torneo:torneo, partida:partida }
  })
  .then(num => {
    res.send({ message: "partida_torneo actualizada." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando la partidas_torneo: " + partidas_torneo });
  });
};

exports.delete = (req, res) => {
  const torneo = req.body.torneo;
  const partida = req.body.partida;
  PartidaTorneo.destroy({
    where: { torneo:torneo, partida:partida }
  })
  .then(num => {
    res.send({ status: "Eliminada" });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error eliminando la partida_torneo: " + partidas_torneo });
  });
};

//No se va a usar
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