const db = require("../models");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;

// Create and Save a new Usuario
exports.create = (req, res) => {
    // Crea un usario
    const usuario = {
      usuario: req.body.usuario,
      contrasenya: req.body.contrasenya,
      mail: req.body.mail,
      copas: 0,
    };
    // Guarda al usuario en la base de datos
    res.send({message : "Usario creado", usuario});
    /*Usuario.create(usuario)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando usuario"
        });
      });
      */
  };

// Devuelve todos los usuarios de la base de datos 
exports.findAll = (req, res) => {
    const nombre_usuario = req.query.usuario;
    res.send({message : "Se ha encontrado al usuario", nombre_usuario});
    /*
    var condition = nombre_usuario ? { nombre_usuario: { [Op.iLike]: `%${nombre_usuario}%` } } : null;
  
    Usuario.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error recuperando usuarios."
        });
      });
    */
  };

// Busca a un usuario
exports.find = (req, res) => {
    const nombre_usuario = req.params.usuario;
    res.send({message : "Se ha encontrado al usuario ", nombre_usuario});
    /*
    Usuario.findByPk(nombre_usuario)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando usuario con id: " + nombre_usuario
        });
    });
    */
  };

// Actualiza un usuario
exports.update = (req, res) => {
    const nombre_usuario = req.params.usuario;
    res.send({message : "Se ha actualizado al usuario ", nombre_usuario});
    /*
    Usuario.update(req.body, {
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
    */
};

// Elimina un usuario
exports.delete = (req, res) => {
    const nombre_usuario = req.params.usuario;
    res.send({message : "Se ha eliminado al usuario ", nombre_usuario});
    /*
    Usuario.destroy({
      where: { nombre_usuario: nombre_usuario }
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
  */
};

// Elimina todos usuario
exports.deleteAll = (req, res) => {
  res.send({message : "Se han eliminado todos los usuarios"});
  /*  
  Usuario.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} usuarios eliminados.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error eliminando usuarios."
        });
      });
      */
  };