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
  const juagdor = req.params.jugador;
  Pertenece.findOne({where:{partida: partida, jugador:juagdor}})
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
            message: err.message || "Error recuperando partida " + partida });
    });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Error recuperando relcion pertenece" });
  });

};

exports.cambiar7 = async (req,res) => {
  try {
    const partida = req.params.nombre;
    const jugador = req.params.jugador;
    const data1 = await Pertenece.findOne({where:{partida: partida, jugador:jugador}})
    const data = await Partida.findByPk(partida)
    const triunfo = data.triunfo;
    //console.log(triunfo);
    var carta = ['c1','c2','c3','c4','c5','c6'];
    var sieteTriunfo = '6' + triunfo[1];
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
      res.status(500).send('No puedes cambiar el 7');
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
        const dataCantante = Pertenece.findOne({where:{partida: partida, jugador: dataPartida[p]}})
        if (dataCantante.equipo === 0){
          if (p[0].toUpperCase() === triunfo){
            p_e0 = p_e0 + 40
          }else{
            p_e0 = p_e0 + 20
          }
        }else{
          if (p[0].toUpperCase() === triunfo){
            p_e1 = p_e1 + 40
          }else{
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

exports.IA = async(req, res) => {
  const partida = req.params.partida
  const carta = req.params.carta
  const dataPartida = Partida.findByPk(partida)
  const paloTriunfo = dataPartida.triunfo[1]
  const cartaTriunfo = dataPartida.triunfo[0]
  const dataCartas = Pertenece.findOne({where:{partida: partida, jugador: 'IA'}})
  const cartas = [dataCartas.c1,dataCartas.c2,dataCartas.c3,dataCartas.c4,dataCartas.c5,dataCartas.c6]
  var posibilidades = []
  //var seHanAcabado = false -->Variable para ver si quedan cartas en el monton del medio (iremos de ultimas o no)

  if (carta === undefined){
    //Si no han lanzado carta
    for(c of cartas){
      const dataCarta = await Carta.findByPk(c)
      //Miro alguna carta de mi mano que no sea triunfo
      if(c[1] != paloTriunfo){
        posibilidades.push(dataCarta)
      }
      //Si todas mis cartas son triunfo, busco la que no valga puntos
      else if(dataCarta.puntuacion == 0){
        posibilidades.push(dataCarta)
      }
    }
  }else{
    var heEchado = new Boolean(false); 
    //Si si han lanzado carta
      if(!seHanAcabado){
        //Aun quedan cartas en el monton del medio, por tanto aun no vamos de arrastre
        //Miro si la carta que han lanzado es triunfo 
        if(carta[1] === paloTriunfo){
          //Si sí es triunfo
          for(c of cartas){
            const dataCarta = await Carta.findByPk(c)
            //Miro alguna carta de mi mano que no valga puntos y no sea triunfo para echar
            if(dataCarta.puntuacion == 0 && (c[1]!= paloTriunfo)){
              posibilidades.push(dataCarta)
            }
            //Miro si tengo algun caballo que no sea triunfo (caballo es la carta que menos puntuacion tiene de las que tienen puntuacion)
            else if(dataCarta.puntuacion == 2 && (c[1]!= paloTriunfo)){
              posibilidades.push(dataCarta)
            }
            //Miro si tengo alguna jota que no sea triunfo (jota es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
            else if(dataCarta.puntuacion == 3 && (c[1]!= paloTriunfo)){
              posibilidades.push(dataCarta)
            }
            //Miro si tengo algun rey que no sea triunfo (rey es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
            else if(dataCarta.puntuacion == 4 && (c[1]!= paloTriunfo)){
              posibilidades.push(dataCarta)
            }
            //Miro si tengo algun triunfo que no valga puntos, ya que es mejor echar eso que un 3 o un as.
            else if(dataCarta.puntuacion == 0 ){
              posibilidades.push(dataCarta)
            }
            //Miro si tengo algun 3 que no sea triunfo entre mis cartas
            else if(dataCarta.puntuacion == 10){
              posibilidades.push(dataCarta)
            }
            //Miro si tengo algun as que no sea triunfo
            else if(dataCarta.puntuacion == 11){
              posibilidades.push(dataCarta)
            }
          }
          if (posibilidades.length === 0){
            posibilidades = cartas
          }
        }
        else{
          //Si la carta que han lanzado no es triunfo
          //Miro de que palo es la carta que ha lanzado
          if(carta[1] === 'O'){
            var posibilidades1 = []
            //Si la carta que han lanzado es de oros
            for(c of cartas){
              const dataCarta = await Carta.findByPk(c)
              //Miro si tengo en mi mano alguna carta de oros tambien que sea mejor que la suya
              if((c[1] === 'O') && (carta.ranking < dataCarta.ranking)){
                posibilidades1.push(dataCarta)
                heEchado = true
              }
            }
            if(heEchado){
              //Miro si hay más de una carta de oros mejor que la que me han echado y decido cual echar, si no echo la que haya
              if(posibilidades1.length == 1){
                //Si hay una única carta en posibilidades1
                posibilidades = posibilidades1
              }else{
                //Si hay más de una carta en posibilidades1
                var max = 0;
                //Miro cual es de mayor puntuacion
                for(p of posibilidades1){
                  const dataCarta = await Carta.findByPk(p);
                  if(p.puntuacion>= max){
                    max=p.puntuacion
                  }
                }
                posibilidades.push(posibilidades1[max])//Nose si esta bien esto
              }
            }else if(!heEchado){
              //No tenemos en nuestra mano o ninguna carta de oros o ninguna de oros mejor que la que han echado, por lo que miramos una "mala" para echar
              for(c of cartas){
                const dataCarta = await Carta.findByPk(c)
                //Miro alguna carta de mi mano que no valga puntos y no sea triunfo para echar
                if(dataCarta.puntuacion == 0 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun caballo que no sea triunfo (caballo es la carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 2 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo alguna jota que no sea triunfo (jota es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 3 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun rey que no sea triunfo (rey es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 4 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun triunfo que no valga puntos, ya que es mejor echar eso que un 3 o un as.
                else if(dataCarta.puntuacion == 0 ){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun 3 que no sea triunfo entre mis cartas
                else if(dataCarta.puntuacion == 10){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun as que no sea triunfo
                else if(dataCarta.puntuacion == 11){
                  posibilidades.push(dataCarta)
                }
              }
            }

          }
          else if(carta[1] === 'E'){
            var posibilidades1 = []
            //Si la carta que han lanzado es de espadas
            for(c of cartas){
              const dataCarta = await Carta.findByPk(c)
              //Miro si tengo en mi mano alguna carta de espadas tambien que sea mejor que la suya
              if((c[1] === 'E') && (carta.ranking < dataCarta.ranking)){
                posibilidades1.push(dataCarta)
                heEchado = true
              }
            }
            if(heEchado){
              //Miro si hay más de una carta de espadas mejor que la que me han echado y decido cual echar, si no echo la que haya
              if(posibilidades1.length == 1){
                //Si hay una única carta en posibilidades1
                posibilidades = posibilidades1
              }else{
                //Si hay más de una carta en posibilidades1
                var max = 0;
                //Miro cual es de mayor puntuacion
                for(p of posibilidades1){
                  const dataCarta = await Carta.findByPk(p);
                  if(p.puntuacion>= max){
                    max=p.puntuacion
                  }
                }
                posibilidades.push(posibilidades1[max])//Nose si esta bien esto
              }
            }else if(!heEchado){
            //No tenemos en nuestra mano o ninguna carta de espadas mejor que la que han echado,  por lo que miramos una "mala" para echar
              for(c of cartas){
                const dataCarta = await Carta.findByPk(c)
                //Miro alguna carta de mi mano que no valga puntos y no sea triunfo para echar
                if(dataCarta.puntuacion == 0 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun caballo que no sea triunfo (caballo es la carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 2 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo alguna jota que no sea triunfo (jota es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 3 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun rey que no sea triunfo (rey es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 4 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun triunfo que no valga puntos, ya que es mejor echar eso que un 3 o un as.
                else if(dataCarta.puntuacion == 0 ){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun 3 que no sea triunfo entre mis cartas
                else if(dataCarta.puntuacion == 10){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun as que no sea triunfo
                else if(dataCarta.puntuacion == 11){
                  posibilidades.push(dataCarta)
                }
              }
            }
          }
          else if(carta[1] === 'C'){
            var posibilidades1 = []
            //Si la carta que han lanzado es de copas
            for(c of cartas){
              const dataCarta = await Carta.findByPk(c)
              //Miro si tengo en mi mano alguna carta de copas tambien que sea mejor que la suya
              if((c[1] === 'C') && (carta.ranking < dataCarta.ranking)){
                posibilidades1.push(dataCarta)
                heEchado = true
              }
            }
            if(heEchado){
              //Miro si hay más de una carta de copas mejor que la que me han echado y decido cual echar, si no echo la que haya
              if(posibilidades1.length == 1){
                //Si hay una única carta en posibilidades1
                posibilidades = posibilidades1
              }else{
                //Si hay más de una carta en posibilidades1
                var max = 0;
                //Miro cual es de mayor puntuacion
                for(p of posibilidades1){
                  const dataCarta = await Carta.findByPk(p);
                  if(p.puntuacion>= max){
                    max=p.puntuacion
                  }
                }
                posibilidades.push(posibilidades1[max])//Nose si esta bien esto
              }
            }else if(!heEchado){
            //No tenemos en nuestra mano o ninguna carta de copas mejor que la que han echado, por lo que miramos una "mala" para echar
              for(c of cartas){
                const dataCarta = await Carta.findByPk(c)
                //Miro alguna carta de mi mano que no valga puntos y no sea triunfo para echar
                if(dataCarta.puntuacion == 0 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun caballo que no sea triunfo (caballo es la carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 2 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo alguna jota que no sea triunfo (jota es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 3 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun rey que no sea triunfo (rey es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 4 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun triunfo que no valga puntos, ya que es mejor echar eso que un 3 o un as.
                else if(dataCarta.puntuacion == 0 ){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun 3 que no sea triunfo entre mis cartas
                else if(dataCarta.puntuacion == 10){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun as que no sea triunfo
                else if(dataCarta.puntuacion == 11){
                  posibilidades.push(dataCarta)
                }
              }
            }
          }else if(carta[1] === 'B'){
            var posibilidades1 = []
            //Si la carta que han lanzado es de bastos
            for(c of cartas){
              const dataCarta = await Carta.findByPk(c)
              //Miro si tengo en mi mano alguna carta de bastos tambien que sea mejor que la suya
              if((c[1] === 'E') && (carta.ranking < dataCarta.ranking)){
                posibilidades1.push(dataCarta)
                heEchado = true
              }
            }
            if(heEchado){
              //Miro si hay más de una carta de bastos mejor que la que me han echado y decido cual echar, si no echo la que haya
              if(posibilidades1.length == 1){
                //Si hay una única carta en posibilidades1
                posibilidades = posibilidades1
              }else{
                //Si hay más de una carta en posibilidades1
                var max = 0;
                //Miro cual es de mayor puntuacion
                for(p of posibilidades1){
                  const dataCarta = await Carta.findByPk(p);
                  if(p.puntuacion>= max){
                    max=p.puntuacion
                  }
                }
                posibilidades.push(posibilidades1[max])//Nose si esta bien esto
              }
            }else if(!heEchado){
              //No tenemos en nuestra mano o ninguna carta de bastos mejor que la que han echado,  por lo que miramos una "mala" para echar
              for(c of cartas){
                const dataCarta = await Carta.findByPk(c)
                //Miro alguna carta de mi mano que no valga puntos y no sea triunfo para echar
                if(dataCarta.puntuacion == 0 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun caballo que no sea triunfo (caballo es la carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 2 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo alguna jota que no sea triunfo (jota es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 3 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun rey que no sea triunfo (rey es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
                else if(dataCarta.puntuacion == 4 && (c[1]!= paloTriunfo)){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun triunfo que no valga puntos, ya que es mejor echar eso que un 3 o un as.
                else if(dataCarta.puntuacion == 0 ){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun 3 que no sea triunfo entre mis cartas
                else if(dataCarta.puntuacion == 10){
                  posibilidades.push(dataCarta)
                }
                //Miro si tengo algun as que no sea triunfo
                else if(dataCarta.puntuacion == 11){
                  posibilidades.push(dataCarta)
                }
              }
            }
          }
        }
      }
    else{
      var posibilidades1 = []
      //Se han acabado las cartas del monton del medio y por tanto es arrastre
      if(carta[1] === paloTriunfo){
        //Si salen con un triunfo
        for(c of cartas){
          const dataCarta = await Carta.findByPk(c)
          const dataTriunfo = await Carta.findByPk(carta)
          //Miro si tengo en mano algun triunfo superior a la carta que han tirado
          if((c[1] === paloTriunfo) && (c.ranking > carta.ranking)){
            posibilidades.push(dataCarta)
          }else if(c[1] === paloTriunfo){
            //Tengo triunfo en mano pero no supera al suyo
            posibilidades1.push(dataCarta)
          }else {
            //No tengo triunfo, pon tanto le doy la carta que menos valga
            if(dataCarta.puntuacion == 0){
              //Le doy una carta sin puntuacion
              posibilidades.push(dataCarta)
            }else if (dataCarta.puntuacion == 2){
              //Le doy un caballo, que es la siguiente carta que menos vale
              posibilidades.push(dataCarta)
            }else if (dataCarta.puntuacion == 3){
              //Le doy una jota, que es la siguiente carta que menos vale
              posibilidades.push(dataCarta)
            }else if (dataCarta.puntuacion == 4){
              //Le doy un rey, que es la siguiente carta que menos vale
            }else if(dataCarta.puntuacion == 10){
              //Le doy un tres, que es la siguiente carta que 
            }
          











          //Miro si tengo algun caballo que no sea triunfo (caballo es la carta que menos puntuacion tiene de las que tienen puntuacion)
          else if(dataCarta.puntuacion == 2 && (c[1]!= paloTriunfo)){
            posibilidades.push(dataCarta)
          }
          //Miro si tengo alguna jota que no sea triunfo (jota es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
          else if(dataCarta.puntuacion == 3 && (c[1]!= paloTriunfo)){
            posibilidades.push(dataCarta)
          }
          //Miro si tengo algun rey que no sea triunfo (rey es la siguiente carta que menos puntuacion tiene de las que tienen puntuacion)
          else if(dataCarta.puntuacion == 4 && (c[1]!= paloTriunfo)){
            posibilidades.push(dataCarta)
          }
          //Miro si tengo algun triunfo que no valga puntos, ya que es mejor echar eso que un 3 o un as.
          else if(dataCarta.puntuacion == 0 ){
            posibilidades.push(dataCarta)
          }
          //Miro si tengo algun 3 que no sea triunfo entre mis cartas
          else if(dataCarta.puntuacion == 10){
            posibilidades.push(dataCarta)
          }
          //Miro si tengo algun as que no sea triunfo
          else if(dataCarta.puntuacion == 11){
            posibilidades.push(dataCarta)
          }
        }
        if (posibilidades.length === 0){
          posibilidades = cartas
        }
      }
    }
  }
  //Una vez decidida que carta echar, aprovechamos el vector de posibilidades que hemos hecho y vemos qué tenemos dentro de este.
  //posibilidades-> Elijo una carta aleatoria de los componentes que tenga
  if(posibilidades.length === 0){
    var aleatorio = Math.random() * (5-0)+0;//Crea un numero aleatorio del 0 al 5
    return cartas[aleatorio]
  }else{
    var longitud = posibilidades.length;
    var aleatorio = Math.random() * (longitud-0)+0;//Crea un numero aleatorio del 0 al valor de la longitud de posibilidades
    return posibilidades[aleatorio]
  }
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
    return [];
  }
}