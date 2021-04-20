const db = require("../models");
const Amigo = db.amigo;
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
    res.send({message: 'Un usuario no puede ser amigo de si mismo'});
  }else{
    Amigo.create(amigo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error creando amigo"
      });
    });
  }  
};

// Devuelve todos los amigos de un usuario
exports.findAll = (req, res) => {
    const usuario = req.params.usuario;  
    Amigo.findAll({ where: {usuario: usuario} })
      .then(dataUsuario => {
        var friends = [];
        i = 0;
        for (a of dataUsuario)
        {
          if (a.dataValues.aceptado === 1){
            //console.log(a.dataValues);
            friends[i] = a.dataValues.amigo;
            i++;
          }
        }
        Amigo.findAll({ where: {amigo: usuario} })
        .then(dataAmigo => {
          i = 0;
          for (a of dataAmigo)
          {
            if (a.dataValues.aceptado === 1){
              //console.log(a.dataValues);
              friends[i + dataUsuario.length] = a.dataValues.usuario;
              i++;
            }

          }
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

exports.listar = (req, res) => {
  const usuario = req.params.usuario;
  const aceptado = req.params.aceptado;
  Amigo.findAll({ where: {usuario: usuario, 0: aceptado} })
  .then(data => {
    if (data === null){
      res.send({ message: `No se ha encontrado ninguna solicitud de amistad a este usuario: ${usuario}` });
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