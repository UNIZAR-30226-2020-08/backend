const db = require("../models");
const Cuadro = db.cuadro_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const cuadro_torneo = {
      id_torneo: req.body.id_torneo,
      id_partida: req.body.id_partida,
      fase: req.body.fase,
      eq_winner: req.body.eq_winner ? req.body.eq_winner : 'NO'
    };
    Cuadro.create(cuadro_torneo)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando cuadro_torneo"
        });
      });
  };

exports.findAll = (req, res) => {
    const ronda = req.params.ronda;
    const id_torneo = req.params.id_torneo;
    var condition = { id_torneo: { [Op.eq]: id_torneo },
                      fase: { [Op.like]: ronda } };
    //console.log(condition)
    Cuadro.findAll({where: {id_torneo:{ [Op.eq]: `${id_torneo}` },
                            fase: { [Op.like]: `%${ronda}%` }}
    }).then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando cuadro_torneo."
        });
      });
  };

exports.find = (req, res) => {
  const id_torneo = req.params.id_torneo;
  const id_partida = req.params.id_partida;
  Cuadro.findAll({
    where: { id_torneo: id_torneo, id_partida: id_partida }
  })
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error recuperando cuadro_torneo: " + cuadro_torneo
      });
  });
};
//No se va a usar
exports.update = (req, res) => {
  const id_torneo = req.params.id_torneo;
  const id_partida = req.params.id_partida;
  Cuadro.update(req.body, {
    where: { id_torneo: id_torneo, id_partida: id_partida }
  })
  .then(num => {
          res.send({ message: "cuadro torneo actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el cuadro_torneo: ${cuadro_torneo}.`
      });
  });
};

exports.delete = (req, res) => {
  const id_torneo = req.params.id_torneo;
  const id_partida = req.params.id_partida;
  Cuadro.destroy({
    where: { id_torneo: id_torneo, id_partida: id_partida }
  })
  .then(num => {
    res.send({status: "Eliminado"});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error eliminando el cuadro torneo: " + cuadro_torneo });
  });
};
//No se va a usar
exports.deleteAll = (req, res) => {
  Cuadro.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} cuadros_torneo eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando cuadros_torneo."
      });
    });
};