const { PASSWORD } = require("../config/db.config");
const db = require("../models");
const Partida = db.partida;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const fecha = new Date();
  const fechaParsed = fecha.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const partida = {
    nombre: req.body.nombre ? req.body.nombre : Math.random().toString(36).substring(2,7),
    triunfo: req.body.triunfo,
    estado: req.body.estado,
    tipo: req.body.tipo,
    fecha: fechaParsed,
  };
  Partida.create(partida)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando partida"
        });
      });
  };

exports.findAll = (req, res) => {
    const partida = req.body.nombre;
    var condition = partida ? { nombre: { [Op.iLike]: `%${partida}%` } } : null;
  
    Partida.findAll({ where: condition })
      .then(data => {
        if (data === null){
          res.send({message: 'No existe la partdia'});
        }else{
          res.send({data});
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando partidas."
        });
      });
  };

exports.find = (req, res) => {
    const partida = req.body.nombre;
    Partida.findByPk(partida)
    .then(data => {
      if (data === null){
        res.send({message: 'No existe la partdia'});
      }else{
        res.send({data});
      }
        
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando partida " + partida
        });
    });
  };

exports.update = (req, res) => {
    const partida = req.body.nombre;
    Partida.update(req.body, {
      where: { nombre: partida }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "partida actualizada."
          });
      } else {
          res.send({
              message: `No se puede actualizar la partida: ${partida}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando la partida: ${partida}`
      });
  });
};

exports.delete = (req, res) => {
    const partida = req.body.nombre;
    Partida.destroy({
      where: { nombre: partida }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Partida eliminada"
            });
        } else {
            res.send({
                status:  `No se pudo eliminar la partida: ${partida}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || `Error eliminando la partida: ${partida}`
        });
    });
};

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las partidas"});
  };