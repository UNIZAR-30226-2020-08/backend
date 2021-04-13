const db = require("../models");
const Fondo_carta = db.fondo_carta;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const fondo_carta = {
      f_carta: req.body.f_carta,
    };
    Fondo_carta.create(fondo_carta)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message:err.message || "Error creando fondo_carta"});
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
      where: { fondo_carta: f_carta }
    })
    .then(num => {
            res.send({status: "Eliminado"});
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
  //const fondo_carta = req.body.f_carta;
  
  //var condition = fondo_carta ? { fondo_carta: { [Op.iLike]: `%${fondo_carta}%` } } : null;
  Fondo_carta.findAll({ /*where: condition*/ })
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
