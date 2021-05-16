const e = require("express");
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
                  '3.1']
    }else if(dataTorneo.nparticipantes === 16){
      nPartidas = 15;
      partidas = ['0.1','0.2','0.3','0.4',
                  '0.5','0.6','0.7','0.8',
                  '1.1','1.2','1.3','1.4','2.1','2.2',
                  '3.1']
    }
    //console.log(partidas)
    var a;
    const fecha = new Date();
      const fechaParsed = fecha.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const fechaLim = (fechaParsed.split("/")[1]) +"-"+(fechaParsed.split("/")[0])+"-"+(fechaParsed.split("/")[2]);
      //console.log(fechaLim);
      const palos = ['O','C','E','B'];
    for (a of partidas){
      console.log(a)
      const n =  Math.floor(Math.random() * 10) + palos[Math.floor(Math.random() * 4)];
      const dataP = {
        nombre: Math.random().toString(36).substring(2,7),
        triunfo: n.toString(),
        estado: 0, //Se incializan en pausa y cuando se haga nextRound se ponen en juego
        tipo: dataTorneo.tipo,
        fecha: fechaLim,
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
    const rondaIni = req.params.ronda
    const rondaPrev = (rondaIni - 1).toString() + '.'
    const ronda = rondaIni.toString() + '.'
    var matches = []
    const dataTorneo = await Torneo.findByPk(torneo)
    var maxEnTorneo = (dataTorneo.tipo + 1)*dataTorneo.nparticipantes
    var maxEnPartida = (dataTorneo.tipo + 1)*2

    const dataRonda = await Cuadro.findAll({
      where: {
        id_torneo:{ [Op.eq]: `${dataTorneo.nombre}` },
        fase: { [Op.like]: `%${ronda}%` }}
      })
    const prevRound = await Cuadro.findAll({
                                  where: {id_torneo : torneo, 
                                  fase: { [Op.like]: `%${rondaPrev}%` }}
                                })
    if (prevRound.length === 0){
      //Implica que es la primera ronda del torneo
      const dataPart = await Participantes.findAndCountAll({ where: { torneo: torneo } }) 
      //console.log(dataPart.count)
      if (dataPart.count < maxEnTorneo){
        res.status(500).send('El torneo no esta completo, NO SE PUEDEN EMPEZAR LOS EMPAREJAMIENTOS' )
      }else{
        // Mezclamos el array de juagdores para hacer los emparejamientos
        const array  = (dataPart.rows).sort(() => Math.random() - 0.5)
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
              const dataR = await Cuadro.findOne({
                where: { id_torneo: torneo, id_partida: a.id_partida }
                })
              matches.push({torneo: torneo, jugador: player.jugador,partida: a.id_partida, fase: dataR.fase})
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
          //Se inicializa la baraja de la partida
          const dataCartas = await Carta.findAll()
          for (card of dataCartas){
            const carta_disponible = {
              partida: a.id_partida,
              carta: card.carta
            };
            const data = await CartaDisponible.create(carta_disponible)
            console.log(`Se ha insertado el ${data.carta}`);
          }
        }
        res.status(200).send(matches)
      }
    }else{
      //Ha habido una ronda previa clasificatoria previa 
        var winners = []
        for (a of prevRound){
          const team = await Pertenece.findAll({where:{partida:a.id_partida, equipo: a.eq_winner}})
          for (i of team){
            const dataWin = {
              jugador: i.jugador,
              fase: a.fase,
            }
            await winners.push(dataWin)
          }
        }
        //Ordena los resultados al reves para poder extraerlos con pop
        winners.sort(function (a,b) {
          if (a.fase < b.fase){
            return 1;
          } 
          if (a.fase > b.fase) {
            return -1;
          }
          // a must be equal to b
          return 0;
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
              var player = winners.pop();
              console.log('player',player)
              const dataR = await Cuadro.findOne({
                where: { id_torneo: torneo, id_partida: a.id_partida }
                })
              matches.push({torneo: torneo, jugador: player.jugador,partida: a.id_partida, fase: dataR.fase})
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
              console.log(data)
              if (dataTorneo.tipo === 1 && i < 2){
                data.equipo = 0
                if(i === 0){data.orden = 1}else{data.orden = 3} 
              }else if(dataTorneo.tipo === 1 && i >= 2){
                data.equipo = 1
                if(i === 2){data.orden = 2}else{data.orden = 4}
              }
              console.log(data)
              const dataPer = await Pertenece.create(data)
              console.log(dataPer)
            }
          }
          //Se inicaliza la baraja de la partida
          const dataCartas = await Carta.findAll()
          for (card of dataCartas){
            const carta_disponible = {
              partida: a.id_partida,
              carta: card.carta
            };
            const data = await CartaDisponible.create(carta_disponible)
            console.log(`Se ha insertado el ${data.carta}`);
          }
        }
      res.status(200).send(matches)
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