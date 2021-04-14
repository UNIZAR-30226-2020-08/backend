const db = require("../models");
const Amigo = db.amigo;
const Op = db.Sequelize.Op;

// Create and Save a new Usuario
exports.create = (req, res) => {
  // Crea un usario
  const amigo = {
    usuario: req.body.usuario,
    amigo: req.body.amigo,
  };
  // Guarda al usuario en la base de datos
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
    const usuario = req.body.usuario;

    var condition = usuario ? { usuario: { [Op.iLike]: `%${usuario}%` } } : null;
  
    Amigo.findAll({ where: condition })
      .then(data => {
        var friends = [];
        i = 0;
        for (a of data)
        {
          //console.log(a.dataValues);
          friends[i] = a.dataValues.amigo;
          i++;
        }
        res.send(friends);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando amigos."
        });
      });
  };

// Busca a un usuario
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

// Actualiza un usuario
exports.update = (req, res) => {
    const nombre_usuario = req.params.usuario;

    Amigo.update(req.body, {
        where: { nombre_usuario: nombre_usuario }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "usuario actualizado."
            });
        } else {
            res.send({
                message: `No se puede actualizar el usuario con id: ${nombre_usuario}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error actualizando usuario con id: " + nombre_usuario
        });
    });
};

// Elimina un usuario
exports.delete = (req, res) => {
  const amigo = req.body.amigo;  
  const usuario = req.body.usuario;

    Amigo.destroy({
      where: { amigo: amigo, usuario: usuario }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el usuario con id: ${nombre_usuario}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el usuario con id: " + nombre_usuario
        });
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