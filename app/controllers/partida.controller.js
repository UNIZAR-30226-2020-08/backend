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
  //const fechaLim = (fechaParsed.split("/")[1]) +"-"+(fechaParsed.split("/")[0])+"-"+(fechaParsed.split("/")[2]);
  //console.log(fechaLim);
  const palos = ['O','C','E','B'];
  const n =  Math.floor(Math.random() * 10) + palos[Math.floor(Math.random() * 4)];
  //console.log(n)
  const partida = {
    nombre: req.body.nombre ? req.body.nombre : Math.random().toString(36).substring(2,7),
    triunfo: req.body.triunfo ? req.body.triunfo : n.toString(),
    estado: req.body.estado ? req.body.estado  : 0,
    tipo: req.body.tipo,
    fecha: fechaParsed,
    o_20: 'NO',
    c_20: 'NO',
    e_20: 'NO',
    b_20: 'NO',
    password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : 'NO',
    puntos_e0: 0,
    puntos_e1: 0,
    id_torneo: req.body.id_torneo ? req.body.id_torneo  : 'NO',
  };
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
      var cantes = devolverCantes(dataPartida,dataPertenece);
      console.log(cantes);
      Partida.update(cantes, {
        where: { nombre: dataPartida.nombre }
      })
      .then(num => {
        res.send(cantes);
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

exports.cambiar7 = (req,res) => {
  const partida = req.params.nombre;
  const jugador = req.params.jugador;
  Pertenece.findOne({where:{partida: partida, jugador:jugador}})
  .then(data1 => {
    Partida.findByPk(partida)
    .then(data => {
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
        Pertenece.update(pertenece, {
          where: { partida: partida, jugador: jugador }
        })
        .then(num => {
          //console.log({ message: "Se ha cambiado el 7 el la mano"});
          var partidaCante = {
            nombre: partida,
            triunfo: sieteTriunfo,
          }
          Partida.update(partidaCante, {
            where: { nombre: partida }
          })
          .then(num => {
            console.log(`${jugador} ha cambiado su ${sieteTriunfo} por el ${triunfo}`);
            res.status(200).send({pertenece,partidaCante});
          })
          .catch(err => {
            res.status(500).send({
                message: err.message || `Error actualizando la partida: ${partida}` });
          });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error actualizando pertenece." });
        });
      }else{
        res.send('No puedes cambiar el 7');
      }
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
    return partida;
  }else{
    return 'No hay cantes';
  }
}