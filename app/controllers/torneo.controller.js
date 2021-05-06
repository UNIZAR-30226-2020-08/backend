const db = require("../models");
const Torneo = db.torneo;
const Participantes = db.participantes_torneo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const torneo = {
    nombre: req.body.nombre ? req.body.nombre : Math.random().toString(36).substring(2,7),
    tipo: req.body.tipo,
    nparticipantes: req.body.nparticipantes,
    contrasenya: req.body.contrasenya ? req.body.contrasenya : 'NO' 
  };
  Torneo.create(torneo)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error creando torneo" });
  });
};

exports.find = (req, res) => {
    const nombre = req.body.nombre;
    Torneo.findByPk(nombre)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || `Error bsucando el torneo ${nombre}`
        });
    });
  };

exports.update = (req, res) => {
  const nombre = req.body.nombre;
  Torneo.update(req.body, {
    where: { nombre: nombre }
  })
  .then(num => {
          res.send({ message: "usuario actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el torneo ${nombre}`
      });
  });
};

exports.delete = (req, res) => {
  const nombre = req.body.nombre;
  Torneo.destroy({
    where: { nombre: nombre }
  })
  .then(num => {
          res.send({ status: "Eliminado" });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando el torneo ${nombre}`
      });
  });
};

exports.deleteAll = (req, res) => {
  Torneo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} torneos eliminados.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando torneos."
      });
    });
  };

exports.findAll = (req, res) => {
  const tipo = req.params.tipo;
  const nEquipos = req.params.nEquipos;
  //console.log(`El tipo es ${tipo} y el numero de equipos ${nEquipos}`)
  Torneo.findAll({ where : { contrasenya: 'NO', tipo: tipo, nparticipantes: nEquipos }})
  .then(dataTorneos => {
    devolverTorneos(dataTorneos,tipo,nEquipos)
    .then(torneosDisponibles => {
      res.send(torneosDisponibles);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error recuperando torneos." });
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error recuperando torneos."
    });
  });
};

async function devolverTorneos(dataTorneos,tipo,nParticipantes)
{
  var torneosDisponibles = [];
  let data;
  var nTorneos = dataTorneos.length;
  var maxPermitidoPartida;
  if (tipo === '0' & nParticipantes === '8'){
    maxPermitidoPartida = 8;
  }else if(tipo === '0' & nParticipantes === '16'){
    maxPermitidoPartida = 16;
  }else if(tipo === '1' & nParticipantes === '8'){
    maxPermitidoPartida = 16;
  }else if(tipo === '1' & nParticipantes === '16'){
    maxPermitidoPartida = 32;
  }
  //console.log(`El max de participantes es ${maxPermitidoPartida}`)
  console.log(`El numero de torneos es: ${nTorneos}`);
  for (a of dataTorneos){
    await Participantes.findAndCountAll({ where: { torneo: a.nombre } })
    .then(dataParticipante => {
      //console.log(dataParticipante);
      data = dataParticipante;
      //console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error recuperando jugadores pertenecientes al torneo." });
    });
    //console.log(data);
    if (data.count < maxPermitidoPartida){
      console.log(`El torneo ${a.nombre} tiene ${data.count}`);
      torneosDisponibles.push( { nombre: a.nombre, 
                                  jugadores_online: data.count });
    }
  }
  //console.log(nPartidas);
  console.log(torneosDisponibles);
  return torneosDisponibles;
}