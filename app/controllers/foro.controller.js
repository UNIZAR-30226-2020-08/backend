const db = require("../models");
const Foro = db.foro;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const foro = {
      partida: req.body.partida,
      mensaje: req.body.mensaje,
      jugador: req.body.jugador,
    };
    Foro.create(foro)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error creando foro" });
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
                err.message || `Error recuperando foro: ${partida}`
        });
    });
  };

    
exports.update = (req, res) => {
  const partida = req.body.partida;
  Foro.update(req.body, {
    where: { partida: partida }
  })
  .then(num => {
          res.send({ message: "foro actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el foro ${partida}`
      });
  });
};

exports.delete = (req, res) => {
  const partida = req.body.partida;
  Foro.destroy({
    where: { partida: partida }
  })
  .then(num => {
          res.send({ status: "Eliminado" });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando el foro ${partida}`
      });
  });
};

//Sin probar por si acaso
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

exports.findAll = (req, res) => {
  Foro.findAll()
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