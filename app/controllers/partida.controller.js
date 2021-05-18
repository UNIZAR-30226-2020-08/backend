const { PASSWORD } = require("../config/db.config");
const db = require("../models");
var bcrypt = require("bcryptjs");
const Partida = db.partida;
const Pertenece = db.pertenece;
const CartaDisponible = db.carta_disponible;
const Carta = db.carta;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const fecha = new Date();
  const fechaParsed = fecha.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const fechaLim = (fechaParsed.split("/")[1]) +"-"+(fechaParsed.split("/")[0])+"-"+(fechaParsed.split("/")[2]);
  console.log(fechaLim);
  const palos = ['O','C','E','B'];
  const n =  Math.floor(Math.random() * 10) + palos[Math.floor(Math.random() * 4)];
  //console.log(n)
  const partida = {
    nombre: req.body.nombre ? req.body.nombre : Math.random().toString(36).substring(2,7),
    triunfo: n.toString(),
    estado: req.body.estado ? req.body.estado  : 0,
    tipo: req.body.tipo,
    fecha: fechaLim,
    o_20: 'NO',
    c_20: 'NO',
    e_20: 'NO',
    b_20: 'NO',
    password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : 'NO',
    puntos_e0: 0,
    puntos_e1: 0,
    id_torneo: 'NO',
  };
  console.log(partida)
  Partida.create(partida)
  .then(dataPartida => {
    Carta.findAll()
    .then(data => {
      for (card of data)
      {
        const carta_disponible = {
          partida: dataPartida.nombre,
          carta: card.carta
        };
        CartaDisponible.create(carta_disponible)
        .then(data => {
          console.log(`Se ha insertado el ${data.carta}`);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Error creando carta_disponible"
          });
        });
      }
      res.send(dataPartida);
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
};

/** 
 * Devuelve todas las salas publicas del tipo que se ha seleccionado y 
 * el numero de usuarios que hay en ella
 **/
exports.findAll = (req, res) => {
  const tipo = req.params.tipo;
  console.log(req.params);
  Partida.findAll({ where: { tipo: tipo, password : 'NO', id_torneo : 'NO'} })
    .then(dataPartidas => {
      devolverPartidas(dataPartidas,tipo)
      .then(partidasDisponibles => {
        res.send(partidasDisponibles);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error recuperando partidas." });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error recuperando partidas." });
    });
};

exports.listarPausadas = (req, res) => {
  try {
    const tipo = req.params.tipo;
    const jugador = req.params.jugador
    var pausadas = []
    console.log(req.params);
    const dataPartidas = await Partida.findAll(
      { where: { tipo: tipo, password : 'NO', id_torneo : 'NO', estado: 1} })
    for (p of dataPartidas){
      const dataPer = await Pertenece.findOne({where:{partida: partida, jugador:jugador}})
      if (dataPer !== undefined){
        pausadas.push({nombre: dataPer.partida})
      }
    }
    res.satus(200).send(pausadas) 
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error al listar las pasadas'});
  }
  

};

exports.find = (req, res) => {
  const partida = req.params.nombre;
  Partida.findByPk(partida)
  .then(data => {
    if (data === null){
      res.send({message: 'No existe la partdia'});
    }else{
      res.send(data);
    } 
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando partida " + partida });
  });
};

exports.update = (req, res) => {
  const partida = req.params.nombre;
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

/**
* Dado un jugador y una partida, comprobar si puede cantar 
**/
exports.cantar = (req,res) => {
  const partida = req.params.nombre;
  const jugador = req.params.jugador;
  Pertenece.findOne({where:{partida: partida, jugador:jugador}})
  .then(dataPertenece => {
    Partida.findByPk(partida)
    .then(dataPartida => {
      var dataCantes = devolverCantes(dataPartida,dataPertenece);
      //console.log(dataCantes.partida);
      //console.log(dataCantes.cantes);
      Partida.update(dataCantes.partida, {
        where: { nombre: dataPartida.nombre }
      })
      .then(num => {
          res.send(dataCantes.cantes);        
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || `Error actualizando la partida: ${partida}` });
      });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error recuperando la partida: ${partida}` });
    });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando relacion pertenece" });
  });

};

exports.cambiar7 = async (req,res) => {
  try {
    const partida = req.params.nombre;
    const jugador = req.params.jugador;
    const data1 = await Pertenece.findOne({where:{partida: partida, jugador:jugador}})
    const data = await Partida.findByPk(partida)
    const triunfo = data.triunfo;
    await CartaDisponible.destroy({ where: { carta: triunfo, partida: partida }
    })
    //console.log(triunfo);
    var carta = ['c1','c2','c3','c4','c5','c6'];
    var sieteTriunfo = '6' + triunfo[1];
    await CartaDisponible.create({partida:partida,carta:sieteTriunfo})
    var cambio = false;
    var posicion;
    for (i = 0; i < 6; i++){
      if (data1[carta[i]] === sieteTriunfo){
        cambio = true;
        posicion = carta[i];
      }
    } 
    if (cambio === true){
      var pertenece = {};
      pertenece['jugador'] = jugador;
      pertenece['partida'] = partida;
      pertenece[posicion] = triunfo;
      //console.log(pertenece);
      const num = await Pertenece.update(pertenece, {
        where: { partida: partida, jugador: jugador }
      })
      //console.log({ message: "Se ha cambiado el 7 el la mano"});
      var partidaCante = {
        nombre: partida,
        triunfo: sieteTriunfo,
      }
      const num1 = await Partida.update(partidaCante, {
        where: { nombre: partida }
      })
        console.log(`${jugador} ha cambiado su ${sieteTriunfo} por el ${triunfo}`);
        pertenece[posicion] = undefined
        pertenece['carta'] = triunfo
        res.status(200).send(pertenece);
    }else{
      res.status(200).send('No puedes cambiar el 7');
  }
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error cambiando el 7'});
  }
     
};
exports.recuento = async (req,res) => {
  try{
    const partida = req.params.partida
    const dataPartida = await Partida.findByPk(partida)
    const triunfo = dataPartida.triunfo[1] 
    var p_e0 = dataPartida.puntos_e0
    var p_e1 = dataPartida.puntos_e1
    const palos = ['o_20','c_20','e_20','b_20']
    for (p of palos){
      if (dataPartida[p] !== 'NO'){
        //console.log('PALO', dataPartida[p])
        const dataCantante = await Pertenece.findOne({where:{partida: partida, jugador: dataPartida[p]}})
        //console.log('EL DATA', dataCantante)
        if (dataCantante.equipo === 0){
          console.log('EL PALO', p[0].toUpperCase(),triunfo)
          if (p[0].toUpperCase() === triunfo){
            //console.log(`Se suman las 40 al equipo 0 y tiene ${p_e0}`)
            p_e0 = p_e0 + 40
          }else{
            //console.log(`Se suman las 20 al equipo 0 y tiene ${p_e0}`)
            p_e0 = p_e0 + 20
          }
        }else if (dataCantante.equipo === 1){
          if (p[0].toUpperCase() === triunfo){
            //console.log(`Se suman las 40 al equipo 1y tiene ${p_e1}`)
            p_e1 = p_e1 + 40
          }else{
            //console.log(`Se suman las 20 al equipo 1 y tiene ${p_e1}`)
            p_e1 = p_e1 + 20
          }
        }
      }
    }
    const dataRecuento = await Partida.update({puntos_e0: p_e0, puntos_e1: p_e1}, {
      where: { nombre: partida }
    })
    const dataPartida1 = await Partida.findByPk(partida)
    res.status(200).send(dataPartida1)
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error en el recuento'});
  }
}

exports.partidaVueltas = async (req,res) => {
  try{
    const partida = req.params.partida
    const palos = ['O','C','E','B'];
    const n =  Math.floor(Math.random() * 10) + palos[Math.floor(Math.random() * 4)];
    const dataRecuento = await Partida.update({triunfo: n}, {
      where: { nombre: partida }
    })
    const data = await Carta.findAll()
    for (card of data)
    {
      const carta_disponible = {
        partida: partida,
        carta: card.carta
      };
      const data1 = await CartaDisponible.create(carta_disponible)
      console.log(`Se ha insertado el ${data1.carta}`);
    }
    res.send(`Partida de vueltas ${partida} inicializada correctamente`);
  }catch(err){
    return res.status(500).send({ message: err | 'Error inicalizando la partida de vueltas'});
  }
}

exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todas las partidas"});
  };

async function devolverPartidas(dataPartidas,tipo)
{
  var partidasDisponibles = [];
  let data;
  var nPartidas = dataPartidas.length;
  var maxPermitidoPartida;
  if (tipo === '0'){
    maxPermitidoPartida = 2;
  }else if(tipo === '1'){
    maxPermitidoPartida = 4;
  }
  console.log(`El numero de partidas es: ${nPartidas}`);
  for (a of dataPartidas){
    await Pertenece.findAndCountAll({ where: { partida: a.nombre } })
    .then(dataPertenece => {
      //console.log(dataPertenece);
      data = dataPertenece;
      //console.log(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error recuperando jugadores pertenecientes a partida." });
    });
    //console.log(data);
    if (data.count < maxPermitidoPartida){
      console.log(`La partida ${a.nombre} tiene ${data.count}`);
      partidasDisponibles.push( { nombre: a.nombre, 
                                  jugadores_online: data.count });
    }
  }
  //console.log(nPartidas);
  console.log(partidasDisponibles);
  return partidasDisponibles;
}

function devolverCantes(data,data1){
  var cantes = [];
  const triunfo = data.triunfo;
  console.log(triunfo[1]);
  var mano = [data1.c1,data1.c2,data1.c3,data1.c4,data1.c5,data1.c6];
  console.log(mano);
  for (i = 0; i < 6; i++){
    if ((mano[i])[0] === '7'){
      var cante = '9' + (mano[i])[1];
      console.log(cante);
      for(j = i - 1; j < 6; j++){
        if(mano[j] === cante.toString()){
          console.log(mano[j]);
          if (cante[1] === triunfo[1]){
            if (data[triunfo[1].toLowerCase() + '_20'] === 'NO'){
              console.log(`Has cantado las 40 en ${triunfo[1]}`);
              cantes.push({partida: data.nombre, palo: triunfo[1].toLowerCase() + '_20', usuario: data1.jugador});
            }else{
              console.log(`Ya se han cantado las 40 en ${triunfo[1]}`);
            }
          }else{
            if (data[cante[1].toLowerCase() + '_20'] === 'NO'){
              console.log(`Has cantado las veinte en ${cante[1]}`);
              cantes.push({partida: data.nombre, palo: cante[1].toLowerCase() + '_20', usuario: data1.jugador});
            }else{
              console.log(`Ya se han cantado las 20 en ${cante[1]}`);
            }
            
          }
        }
      }
    }else if((mano[i])[0] === '9'){
      var cante = '7' + (mano[i])[1];
      console.log(cante);
      for(j = i; j < 6; j++){
        if(mano[j].toString() === cante.toString()){
          console.log(mano[j]);
          if (cante[1] === triunfo[1]){
            if (data[triunfo[1].toLowerCase() + '_20'] === 'NO'){
              console.log(`Has cantado las 40 en ${triunfo[1]}`);
              cantes.push({partida: data.nombre, palo: triunfo[1].toLowerCase() + '_20', usuario: data1.jugador});
            }else{
              console.log(`Ya se han cantado las 40 en ${triunfo[1]}`);
            }
          }else{
            if (data[cante[1].toLowerCase() + '_20'] === 'NO'){
              console.log(`Has cantado las veinte en ${cante[1]}`);
              cantes.push({partida: data.nombre, palo: cante[1].toLowerCase() + '_20', usuario: data1.jugador});
            }else{
              console.log(`Ya se han cantado las 20 en ${cante[1]}`);
            }
          }
        }
      }
    }
  }
  if (cantes.length !== 0){
    var partida = {};
    partida['nombre'] = cantes[0].partida;
    for (a of cantes){
      partida[a.palo] = a.usuario; 
    }
    return {partida,cantes};
  }else{
    return {cantes};
  }
}

exports.IArti = async (req,res) => {
  try{
    const partida = req.params.partida
    const carta = req.params.carta
    console.log('partida: ', partida,' cartas: ', carta)
    const dataPartida = await Partida.findByPk(partida)
    const paloTriunfo = dataPartida.triunfo[1]
    const dataCartas = await Pertenece.findOne({where:{partida: partida, jugador: 'IA'}})
    const cartas = [dataCartas.c1,dataCartas.c2,dataCartas.c3,dataCartas.c4,dataCartas.c5,dataCartas.c6]
    var posibilidades = []
    var posibilidadesMatar = []
    const dataCartasDisponibles = await CartaDisponible.findAll({where:{partida: partida}})
    if (dataCartasDisponibles.length !== 1){
      //NO VAMOS DE ARRASTRE
      console.log('NO VAMOS DE ARRASTRE')
      if (carta === 'NO'){
        //Si no han lanzado carta
        //Lanzo una carta de mi mano que no sea triunfo y valga 0 puntos
        for(c of cartas){
          const dataCarta = await Carta.findByPk(c)
          if((c[1] !== paloTriunfo)  && (dataCarta.puntuacion === 0)){
            posibilidades.push(dataCarta)
          }
        }
        //Si no hay cartas de 0 puntos tiro una que no sea triunfo
        if (posibilidades.length !== 0){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            
            if((c[1] !== paloTriunfo)){
              posibilidades.push(dataCarta)
            }
          }
        }
        //Si tienes todas de triunfo
        if (posibilidades.length === 0){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            posibilidades.push(dataCarta)
          }
        }
        //Una vez se han evaluado todas las posibilidades se 
        //ordena por ranking ascendente para tirar la carta mas baja
        posibilidades.sort(function (a,b) {
          if (a.ranking > b.ranking){
            return 1;
          }
          if (a.ranking < b.ranking) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        res.status(200).send({jugador: 'IA', carta: (posibilidades.pop()).carta})
      }
      //Si si han lanzado carta
      else{ 
        const dataRecibida = await Carta.findByPk(carta)
        //SI SE HA LANZADO UNA CARTA QUE NO SEA NI AS NI 3
        if (dataRecibida.ranking > 2){
          //Busco matar con el msimo palo
          for (c of cartas){
            const dataCarta = await Carta.findByPk(c)
            if ((dataCarta.carta[1] === dataRecibida.carta[1]) && (dataCarta.ranking < dataRecibida.ranking)){
              posibilidadesMatar.push(dataCarta)
            }
          }
          console.log(posibilidadesMatar)
          //Busco no matar con cartas sin puntos
          if ((posibilidades.length === 0) && (posibilidadesMatar.length === 0)){
            for (c of cartas){
              const dataCarta = await Carta.findByPk(c)
              if ((dataCarta.ranking > dataRecibida.ranking)){
                posibilidades.push(dataCarta)
              }
            }
          }
          //Si no puedo matar ni tengo cartas sin puntos cojo todas menos las de 
          //triunfo y tiro la de menor puntuacion
          if ((posibilidades.length === 0) && (posibilidadesMatar.length === 0)){
            for (c of cartas){
              const dataCarta = await Carta.findByPk(c)
              if ((dataCarta.carta[1] !== paloTriunfo)){
                posibilidades.push(dataCarta)
              }
            }
          }
          //Si tienes todas de triunfo
          if ((posibilidades.length === 0) && (posibilidadesMatar.length === 0)){
            posibilidades = cartas
          }
          if (posibilidadesMatar.length !== 0){
            //Una vez se han evaluado todas las posibilidades se 
            //ordena por ranking descendente
            posibilidadesMatar.sort(function (a,b) {
              if (a.ranking < b.ranking){
                return 1;
              }
              if (a.ranking > b.ranking) {
                return -1;
              }
              // a must be equal to b
              return 0;
            })
            posibilidades = posibilidadesMatar
          }else{
            //Una vez se han evaluado todas las posibilidades se 
            //ordena por ranking ascencdente
            posibilidades.sort(function (a,b) {
              if (a.ranking > b.ranking){
                return 1;
              }
              if (a.ranking < b.ranking) {
                return -1;
              }
              // a must be equal to b
              return 0;
            })
          }
          console.log('Posibilidades', posibilidades)
          res.status(200).send({jugador: 'IA', carta: (posibilidades.pop()).carta})
        }
        //SI SE HA JUGADO O AS O 3
        else{
          //Busco matar con el msimo palo
          for (c of cartas){
            const dataCarta = await Carta.findByPk(c)
            if ((dataCarta.carta[1] === dataRecibida.carta[1]) && (dataCarta.ranking < dataRecibida.ranking)){
              posibilidades.push(dataCarta)
            }
          }
          //Si no tengo el as de ese palo busco un triunfo bajo
          if (posibilidades.length === 0){
            for (c of cartas){
              const dataCarta = await Carta.findByPk(c)
              if ((dataCarta.carta[1] === paloTriunfo) && (dataCarta.ranking > 6)){
                posibilidades.push(dataCarta)
              }
            }
          }
          //Si no hay triunfo bajo se deja pasar
          if (posibilidades.length === 0){
            for (c of cartas){
              const dataCarta = await Carta.findByPk(c)
              if ((dataCarta.carta[1] !== paloTriunfo)){
                posibilidades.push(dataCarta)
              }
            }
          }
          //Si tienes todas de triunfo
          if (posibilidades.length === 0){
            posibilidades = cartas
          }
          //Una vez se han evaluado todas las posibilidades se 
          //ordena por ranking ascendente para tirar la carta mas baja
          posibilidades.sort(function (a,b) {
            if (a.ranking > b.ranking){
              return 1;
            }
            if (a.ranking < b.ranking) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
          console.log('Posibilidades', posibilidades)
          res.status(200).send({jugador: 'IA', carta: (posibilidades.pop()).carta})
        }
      }
    }
    //VAMOS DE ARRASTRE
    else{
      //Si no han lanzado carta
      if (carta === 'NO'){
        //Lanzo una carta de mi mano que no sea triunfo y valga 0 puntos
        for(c of cartas){
          const dataCarta = await Carta.findByPk(c)
          if((c[1] !== paloTriunfo)  && (dataCarta.puntuacion === 0) && (dataCarta.carta !== 'NO')){
            posibilidades.push(dataCarta)
          }
        }
        //Si no hay cartas de 0 puntos tiro una que no sea triunfo
        if (posibilidades.length !== 0){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            
            if((c[1] !== paloTriunfo) && (dataCarta.carta !== 'NO')){
              posibilidades.push(dataCarta)
            }
          }
        }
        //Si tienes todas de triunfo
        if (posibilidades.length === 0){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            
            if(dataCarta.carta !== 'NO'){
              posibilidades.push(dataCarta)
            }
          }
        }
        //Una vez se han evaluado todas las posibilidades se 
        //ordena por ranking ascendente para tirar la carta mas baja
        posibilidades.sort(function (a,b) {
          if (a.ranking > b.ranking){
            return 1;
          }
          if (a.ranking < b.ranking) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        res.status(200).send({jugador: 'IA', carta: (posibilidades.pop()).carta})
      }
      //Si si han lanzado carta
      else{ 
        const dataRecibida = await Carta.findByPk(carta)
        //Compruebo si tengo cartas de ese palo de menor ranking (QUE PUEDA MATAR)
        for(c of cartas){
          const dataCarta = await Carta.findByPk(c)
          if((c[1] === dataRecibida.carta[1]) && (dataCarta.ranking < dataRecibida.ranking) && (dataCarta.carta !== 'NO')){
            posibilidadesMatar.push(dataCarta)
          }
        }
        //Compruebo si tengo cartas de ese palo
        if ((posibilidadesMatar.length === 0)){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            if((c[1] === dataRecibida.carta[1]) && (dataCarta.carta !== 'NO')){
              posibilidades.push(dataCarta)
            }
          }
        }
        //Si no tengo cartas de ese palo pero si triunfo
        if ((posibilidades.length === 0) && (posibilidadesMatar.length === 0)){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            if((c[1] === paloTriunfo) && (dataCarta.carta !== 'NO')){
              posibilidades.push(dataCarta)
            }
          }
        }
        //Si no tengo cartas de ese palo ni triunfo 
        if ((posibilidades.length === 0) && (posibilidadesMatar.length === 0)){
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            if(dataCarta.carta !== 'NO'){
              posibilidades.push(dataCarta)
            }
          }
        }
        //Lanzo carta 
        if (posibilidadesMatar.length !== 0){
          //Una vez se han evaluado todas las posibilidades se 
          //ordena por puntuacion ascendente
          posibilidadesMatar.sort(function (a,b) {
            if (a.ranking < b.ranking){
              return 1;
            }
            if (a.ranking > b.ranking) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
          posibilidades = posibilidadesMatar
        }else{
          //Una vez se han evaluado todas las posibilidades se 
          //ordena por puntuacion descendente
          posibilidades.sort(function (a,b) {
            if (a.ranking > b.ranking){
              return 1;
            }
            if (a.ranking < b.ranking) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
        }
        res.status(200).send({jugador: 'IA', carta: (posibilidades.pop()).carta})
      }
    }
  }catch(err){
    return res.status(500).send({ message: err | 'Error con la IA'});
  }
}

exports.historial = async(req,res) => {
  try {
    const jugador = req.params.jugador;
    var history = []
    var teamWinner;
    var data;
    const dataParticipadas = await Pertenece.findAll({where: {jugador: jugador}})
    //console.log(dataParticipadas)
    for (p of dataParticipadas) {
      const dataPartida = await Partida.findByPk(p.partida)
      if (dataPartida.estado === 0){
        //console.log('LA PARTIDA', dataPartida)
        if (dataPartida.puntos_e0 > 101){
          console.log(`En la partida ${dataPartida.nombre} ha gandado 0 con ${dataPartida.puntos_e0} puntos`)
          teamWinner = 0
        }else if (dataPartida.puntos_e1 > 101){
          console.log(`En la partida ${dataPartida.nombre} ha gandado 1 con ${dataPartida.puntos_e0} puntos`)
          teamWinner = 1
        }else{
          teamWinner = 2
        }
        if (teamWinner !== 2){
          //console.log('TEAM WINNER', teamWinner)
          if (p.equipo === teamWinner){
            data = {
              estado: 'VICTORIA',
              partida: p.partida,
              tipo: dataPartida.tipo,
              puntos_e0: dataPartida.puntos_e0,
              puntos_e1: dataPartida.puntos_e1
            }
          }else{
            data = {
              estado: 'DERROTA',
              partida: p.partida,
              tipo: dataPartida.tipo,
              puntos_e0: dataPartida.puntos_e0,
              puntos_e1: dataPartida.puntos_e1
            }
          }
          history.push(data)
        }
      }
    }
    res.status(200).send(history)
  }catch(err){
    return res.status(500).send({ message: err | 'Error al crear el historial'});
  }
}