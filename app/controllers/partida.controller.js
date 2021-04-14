const { PASSWORD } = require("../config/db.config");
const db = require("../models");
const Partida = db.partida;
const Pertenece = db.pertenece;
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

/** 
 * Devuelve todas las salas del tipo que se ha seleccionado y 
 * el numero de usuarios que hay en ella
 **/
// NO VA
exports.findAll = (req, res) => {
  const tipo = req.body.tipo;
  var sol = [];
  Partida.findAll({ where: { tipo: tipo} })
    .then(dataPartidas => {
        var i = dataPartidas.length - 1;
        console.log(`i es: ${i}`);
        for (a of dataPartidas){
          console.log(`La partida es ${a.nombre}`);
          //console.log(a.dataValues);
          Pertenece.findAll({ where: { partida: a.nombre } })
          .then(data => {
            //console.log(data.length);
            if (data.length > 0){
              var partida = {
                nombre: data[0].partida,
                jugadores_online: (data.length > 0) ? data.length : 0,
                tipo : (tipo == 0) ? 'Individual' : 'Parejas',
              };
              sol.push(partida);
            }
          })
          .catch(err => {
            res.status(500).send({
              message: err.message || "Error recuperando jugadores pertenecientes a partida." });
          });
          i--;
        }
      res.send(sol);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error recuperando partidas." });
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
          message: err.message || "Error recuperando partida " + partida });
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