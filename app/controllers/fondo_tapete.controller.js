const db = require("../models");
//const fondo_carta = require("../models/fondo_carta");
//const fondo_tapete = require("../models/fondo_tapete");
const Fondo_tapete = db.fondo_tapete;
const Customizable = db.customizable;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const customizable = {
    imagen: req.body.f_tapete,
  };
  Customizable.create(customizable)
    .then(dataCustom => {
      const fondo_tapete = {
        f_tapete: req.body.f_tapete,
      };
      Fondo_tapete.create(fondo_tapete)
        .then(dataFTapete => {
          res.send({dataCustom,dataFTapete});
        })
        .catch(err => {
          res.status(500).send({message:err.message || "Error creando fondo_tapete"});
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error creando customizable"
      });
    });
  };
 

  
exports.find = (req, res) => {
  const f_tapete = req.body.f_tapete;
  Fondo_tapete.findByPk(f_tapete)
  .then(data => {
      res.send({data});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error recuperando fondo_tapete: ${f_tapete}`
      });
  });
};


exports.find = (req, res) => {
  const f_tapete = req.body.f_tapete;
  Fondo_tapete.findByPk(f_tapete)
  .then(data => {
      res.send({data});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error recuperando fondo_tapete: " + f_tapete
      });
  });
};
 
//No se va a usar
exports.update = (req, res) => {
    const f_tapete = req.body.f_tapete;
    Fondo_tapete.update(req.body, {
      where: { f_tapete: fondo_tapete }
  })
  .then(num => {
          res.send({message: "fondo_tapete actualizado."});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el fondo_tapete:  ${fondo_tapete}`
      });
  });
};


exports.delete = (req, res) => {
    const f_tapete = req.body.f_tapete;
    Fondo_tapete.destroy({
      where: { f_tapete: f_tapete }
    })
    .then(num => {
      Customizable.destroy({
        where: { imagen: f_tapete }
      })
      .then(num => {
              res.send({ status: "Eliminado customizable" });
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || `Error eliminando el customizable:  ${f_tapete}.` });
      });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error eliminando el fondo_carta ${f_tapete}` 
        });
    });
};


exports.deleteAll = (req, res) => {
  Fondo_tapete.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} fondos_tapete eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando fondos_tapete."
      });
    });
};

 
exports.findAll = (req, res) => {
  Fondo_tapete.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando fondos_tapete."
      });
    });
};
