const db = require("../models");
const Torneo = db.torneo;
const Participantes = db.participantes_torneo;
const Cuadro = db.cuadro_torneo;
const Partida = db.partida;
const Carta = db.carta;
const CartaDisponible = db.carta_disponible;
const Pertenece = db.pertenece;
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
      partidas = ['1.1','1.2','1.3','1.4','2.1','2.2',
                  '3']
    }else if(dataTorneo.nparticipantes === 16){
      nPartidas = 15;
      partidas = ['0.1','0.2','0.3','0.4',
                  '0.5','0.6','0.7','0.8',
                  '1.1','1.2','1.3','1.4','2.1','2.2',
                  '3']
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

exports.matchRound = async (req,res) => {
  try {
    const torneo = req.params.torneo
    const ronda = req.params.ronda
    const rondaAux = ronda - 1
    const notFirstRound = await Cuadro.findAll({where: {id_torneo : torneo, fase: rondaAux}})
    if (notFirstRound === undefined ){
      //Implica que es la primera ronda
    }else{
      //Ha habido una ronda previa
    }
    const dataTorneo = await Torneo.findByPk(torneo)
    var maxEnTorneo 
    var maxEnPartida
    if (dataTorneo.tipo === 0 & dataTorneo.nparticipantes === 8){
      maxEnTorneo = 8
      maxEnPartida = 2
    }else if(dataTorneo.tipo === 0 & dataTorneo.nparticipantes === 16){
      maxEnTorneo = 16
      maxEnPartida = 2
    }else if(dataTorneo.tipo === 1 & dataTorneo.nparticipantes === 8){
      maxEnTorneo = 16
      maxEnPartida = 4
    }else if(dataTorneo.tipo === 1 & dataTorneo.nparticipantes === 16){
      maxEnTorneo = 32
      maxEnPartida = 4
    }
    const dataPart = await Participantes.findAndCountAll({ where: { torneo: torneo } }) 
    console.log(dataPart.count)
    if (dataPart.count < maxEnTorneo){
      res.status(500).send('El torneo no esta completo, NO SE PUEDEN EMPEZAR LOS EMPAREJAMIENTOS' )
    }else{
      // Mezclamos el array de juagdores para hacer los emparejamientos
      const array  = (dataPart.rows).sort(() => Math.random() - 0.5)
      const dataRonda = await Cuadro.findAll({
                                where: {
                                  id_torneo:{ [Op.eq]: `${dataTorneo.nombre}` },
                                  fase: { [Op.like]: `%${ronda}%` }}
                                })
      for (a of dataRonda){
        for (var i = 0; i < maxEnPartida; i++){
          const dataCount = await Pertenece.findAll({where: { partida: a.id_partida}})
          if (dataTorneo.tipo === 0 && dataCount.length >= 2){
            res.status(500).send("Partida individual llena");
          }
          else if (dataTorneo.tipo === 1 && dataCount.length >= 4){
            res.status(500).send("Partida dobles llena");
          }else{
            var player = array.pop();
            const data = 
            {
              jugador: player.jugador,
              partida: a.id_partida,
              equipo: (dataCount.length) % 2,
              orden: dataCount.length + 1,
              c1: req.body.c1 ? req.body.c1 : 'NO',
              c2: req.body.c2 ? req.body.c2 : 'NO',
              c3: req.body.c3 ? req.body.c3 : 'NO',
              c4: req.body.c4 ? req.body.c4 : 'NO',
              c5: req.body.c5 ? req.body.c5 : 'NO',
              c6: req.body.c6 ? req.body.c6 : 'NO',  
            }
            const dataPer = await Pertenece.create(data)
          }
        }
      }
      res.status(200).send('se ha emparejado correctamente la ronda')
    }
  }catch(err){
    return res.status(500).send({ message: err | 
      'se ha producido un error haciendo los emparejamientos'});
  }
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