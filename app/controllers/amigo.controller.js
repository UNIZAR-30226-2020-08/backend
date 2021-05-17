const db = require("../models");
const Amigo = db.amigo;
const Usuario = db.usuario;
const Op = db.Sequelize.Op;

// Create and Save a new Usuario
exports.create = (req, res) => {
  // Crea un amigo
  const amigo = {
    usuario: req.body.usuario,
    amigo: req.body.amigo,
    aceptado: req.body.aceptado ? req.body.aceptado : 0
  };
  // Guarda al amigo en la base de datos
  if (amigo.usuario === amigo.amigo){
    res.send('Un usuario no puede ser amigo de si mismo');
  }else{
    Amigo.findOne({ where: {usuario: amigo.usuario, amigo:amigo.amigo} })
    .then(data => {
      if (data === null){
        Amigo.findOne({ where: {usuario: amigo.amigo, amigo:amigo.usuario} })
        .then(data => {
          if (data === null){
            Amigo.create(amigo)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({ message: err.message || "Error creando amigo" });
            });
          }else{
            res.send('Ya existe esta amistad');
          }
        }).catch(err => {
          res.status(500).send({ message: err.message || "Error buscando par de amigo" });
        })
      }else {
        res.send('Ya existe esta amistad');
      }
    }).catch(err => {
      res.status(500).send({ message: err.message || "Error buscando par de amigo" });
    })
  }  
};

// Devuelve todos los amigos de un usuario
exports.findAll = (req, res) => {
    const usuario = req.params.usuario;  
    Amigo.findAll({ where: {usuario: usuario} })
      .then(async dataUsuario => {
        var friends = [];
        var i = 0;
        for (a of dataUsuario)
        {
          if (a.dataValues.aceptado === 1){
            //console.log(a.dataValues);
            await Usuario.findByPk(a.dataValues.amigo)
            .then(data => {
              data.password = undefined;
              friends[i] = data;
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error recuperando usuario" });
            });
            i++;
          }
        }
        Amigo.findAll({ where: {amigo: usuario} })
        .then(async dataAmigo => {
          var j = 0;
          for (a of dataAmigo)
          {
            if (a.dataValues.aceptado === 1){
              //console.log(a.dataValues);
              await Usuario.findByPk(a.dataValues.usuario)
              .then(data => {
                data.password = undefined;
                friends[j + i] = data;
              })
              .catch(err => {
                  res.status(500).send({ message: err.message || "Error recuperando usuario" });
              });
              j++;
            }
          }
          //Ordena por orden descendente de copas
          friends.sort(function (a,b) {
            if (a.copas < b.copas){
              return 1;
            }
            if (a.copas > b.copas) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
          res.send(friends);
        }).catch(err => {
          res.status(500).send({ message: err.message || "Error recuperando amigos." });
        });
        
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando amigos."
        });
      });
  };

// Busca a un amigo PERO ESTA MAL
exports.find = (req, res) => {
    const nombre_usuario = req.body.usuario;

    Amigo.findByPk(nombre_usuario)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando usuario con id: " + nombre_usuario
        });
    });
  };

// Actualiza un amigo
exports.update = (req, res) => {
    const usuario = req.params.usuario;
    const amigo = req.params.amigo;

    Amigo.update(req.body, {
        where: { usuario: usuario,amigo:amigo }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "usuario actualizado."
            });
        } else {
            res.send({
                message: `No se puede actualizar el usuario con id: ${usuario}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error actualizando usuario con id: " + usuario
        });
    });
};

exports.aceptar = (req, res) => {
  const usuario = req.params.usuario;
  const amigo = req.params.amigo;
  Amigo.findOne({ where: {usuario: usuario, amigo:amigo} })
  .then(data => {
    if (data === null){
    //Si obtenemos null en esta primera búsqueda, cambiamos el usuario por el amigo, ya que 
    //pueden encontrarse primero uno o el otro
      Amigo.findOne({ where: {amigo: usuario, usuario:amigo} })
      .then(data => {
        if (data === null){
          //No se ha aceptado la solicitud de amigo
          res.send({ message: "No se ha aceptado la solicitud (aceptado = 0)." });
        }else{
            Amigo.update({aceptado: 1}, {
              where: {amigo: usuario, usuario:amigo}
            })
            .then(num => {
                    res.send({message: "usuario actualizado."});
            })
            .catch(err => {
                res.status(500).send({
                    message: 
                        err.message || `Error actualizando usuario con id: ${usuario}`
                });
            });
        }
      }).catch(err => {
        res.status(500).send({ message: err.message || "Error recuperando amigos." });
      });
    }else{
        Amigo.update({aceptado: 1}, {
          where: {usuario: usuario, amigo:amigo}
        })
        .then(num => {
          res.send({message: "usuario actualizado."});
        }).catch(err => {
          res.status(500).send({
            message: err.message || `Error actualizando usuario con id:  ${usuario}` });
        });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message || "Error recuperando amigos." });
  });
};

exports.listarSolicitudes = (req, res) => {
  const usuario = req.params.usuario
  Amigo.findAll({ where: {amigo: usuario, aceptado: 0} })
  .then(data => {
    if (data.length === 0){
      res.send({ message: `No se ha encontrado ninguna solicitud de amistad` });
    }else{
      res.send(data);
    }
  }).catch(err => {
    res.status(500).send({ message: err.message || "Error recuperando amigos." });
  });
};


// Elimina un usuario
exports.delete = (req, res) => {
  const amigo = req.params.amigo;  
  const usuario = req.params.usuario;

    Amigo.destroy({
      where: { amigo: amigo, usuario: usuario }
    })
    .then(num => {
      if (num === 1) {
        res.send({ status: "Eliminado" });
      } else {
          console.log(`No se encuentra la amistad: ${usuario}, ${amigo}.`);
          Amigo.destroy({
            where: { usuario: amigo, amigo: usuario }
          })
          .then(num => {
            if (num === 1) {
                res.send({ status: "Amigo eliminado" });
            } else {
                console.log(`No se encuentra la amistad: ${amigo}, ${usuario}.`);
            }
          })
          .catch(err => {
            res.status(500).send({
              message: err.message || `Error eliminando el usuario con id:  ${usuario}`});
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error eliminando el usuario con id:  ${usuario}`});
    });
};

// Elimina todos amigos de un usuario
exports.deleteAll = (req, res) => {
  const usuario = req.body.usuario;
  const user = {
    usuario: req.body.usuario
  };
  Amigo.findAll(user).then(data => 
  {
    Amigo.destroy({
      where: {usuario: usuario},
      truncate: false
    }).then(nums => {
      i = 0;
      for (a of data)
      {
        Amigo.destroy({
          where: {amigo: a.dataValues.usuario, usuario: a.dataValues.amigo}
        })
        .then(num => { console.log('Elimiando correctamente');
        }).catch(err => {
            res.status(500).send({
                message: 
                    err.message || "Error eliminando el usuario con id: " + nombre_usuario
            });
        });
      }
      res.send({ message: 'Se han eliminado todos los amigos de ', usuario });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error eliminando usuarios."});
    });
    
  }).catch(err => {
    res.status(500).send({ message: err.message || "Error eliminando usuarios."});
  });
};