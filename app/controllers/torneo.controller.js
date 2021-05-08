const db = require("../models");
const Torneo = db.torneo;
const Participantes = db.participantes_torneo;
const Cuadro = db.cuadro_torneo;
const Partida = db.partida;
const Carta = db.carta;
const CartaDisponible = db.carta_disponible;
const Op = db.Sequelize.Op;

exports.create = async(req, res) => {
  const torneo = {
    nombre: req.body.nombre ? req.body.nombre : Math.random().toString(36).substring(2,7),
    tipo: req.body.tipo,
    nparticipantes: req.body.nparticipantes,
    contrasenya: req.body.contrasenya ? req.body.contrasenya : 'NO' 
  };
  await Torneo.create(torneo)
  .then(async dataTorneo => {
    var nPartidas;
    var partidas = []
    if (dataTorneo.nparticipantes === 8){
      nPartidas = 7;
      partidas = ['octavos1','octavos2','octavos3','octavos4','semifinal1','semifinal2',
                  'final']
    }else if(dataTorneo.nparticipantes === 16){
      nPartidas = 15;
      partidas = ['dieciseisavos1','dieciseisavos2','dieciseisavos3','dieciseisavos4',
                  'dieciseisavos5','dieciseisavos6','dieciseisavos7','dieciseisavos8',
                  'octavos1','octavos2','octavos3','octavos4','semifinal1','semifinal2',
                  'final']
    }
    //console.log(partidas)
    var a;
    const fecha = new Date();
      const fechaParsed = fecha.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
      //const fechaLim = (fechaParsed.split("/")[1]) +"-"+(fechaParsed.split("/")[0])+"-"+(fechaParsed.split("/")[2]);
      //console.log(fechaLim);
      const palos = ['O','C','E','B'];
    for (a of partidas){
      console.log(a)
      const n =  Math.floor(Math.random() * 10) + palos[Math.floor(Math.random() * 4)];
      const dataP = {
        nombre: Math.random().toString(36).substring(2,7),
        triunfo: n.toString(),
        estado: 1, //Se incializan en pausa y cuando se haga nextRound se ponen en juego
        tipo: dataTorneo.tipo,
        fecha: fechaParsed,
        o_20: 'NO',
        c_20: 'NO',
        e_20: 'NO',
        b_20: 'NO',
        password: 'NO',
        puntos_e0: 0,
        puntos_e1: 0,
        id_torneo: dataTorneo.nombre,
      };
      await Partida.create(dataP)
      .then(async dataPartida => {
        await Carta.findAll()
        .then(async dataCartas => {
          for (card of dataCartas)
          {
            const carta_disponible = {
              partida: dataPartida.nombre,
              carta: card.carta
            };
            const data = await CartaDisponible.create(carta_disponible)
              console.log(`Se ha insertado el ${data.carta}`);
          }
          const dataCuad = {
            id_torneo: dataTorneo.nombre,
            id_partida: dataPartida.nombre,
            fase: a,
            eq_winner: 6
          };
          const dataCuadro = await Cuadro.create(dataCuad)
          console.log(dataPartida,dataCuadro);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Error recuperando cartas."
          });
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando partida"
        });
      });
    }
    res.send(dataTorneo);
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

exports.findAll = async (req, res) => {
  const tipo = req.params.tipo;
  const nEquipos = req.params.nEquipos;
  try {
    const dataTorneos = await Torneo.findAll({ 
      where : { contrasenya: 'NO',
                tipo: tipo, 
                nparticipantes: nEquipos 
              }})
    const torneosDisponibles = await devolverTorneos(dataTorneos,tipo,nEquipos)
    res.send(torneosDisponibles);
  }catch(err){
    return res.status(500).send({ message: err | 
                                  'se ha producido un error buscando los torneos'});
  }
};

async function devolverTorneos(dataTorneos,tipo,nParticipantes) {
  var torneosDisponibles = [];
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
  for (a of dataTorneos){
    const data = await Participantes.findAndCountAll({ where: { torneo: a.nombre } })
    if (data.count < maxPermitidoPartida){
      torneosDisponibles.push( { nombre: a.nombre, 
                                 jugadores_online: data.count })
    }
  }
  console.log(torneosDisponibles);
  return torneosDisponibles;
}