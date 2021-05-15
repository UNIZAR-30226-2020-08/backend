const db = require("../models");
var bcrypt = require("bcryptjs");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;

// Create and Save a new Usuario
exports.create = (req, res) => {
    // Crea un usario
    const usuario = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      copas: req.body.copas ? req.body.copas: 0,
      f_perfil: req.body.f_perfil ? req.body.f_perfil: 'userlogo1',
      f_tapete: req.body.f_tapete ? req.body.f_tapete: 'tapete1',
      f_carta: req.body.f_carta ? req.body.f_carta: 'baraja1',
    };
    // Guarda al usuario en la base de datos
    Usuario.create(usuario)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error creando usuario" });
      });
  };

// Devuelve todos los usuarios de la base de datos 
exports.findAll = (req, res) => {
  Usuario.findAll()
    .then(data => {
      //Ordena por orden descendente de copas
      data.sort(function (a,b) {
        if (a.copas < b.copas){
          return 1;
        }
        if (a.copas > b.copas) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error recuperando usuarios."
      });
    });
};

// Busca a un usuario
exports.find = (req, res) => {
    const username = req.params.username;

    Usuario.findByPk(username)
    .then(data => {
      data.password = undefined;
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando usuario con id: " + username
        });
    });
  };

exports.ganarPartida = async (req,res) => {
  try {
    const usuario = req.params.username
    const dataUsuario = await Usuario.findByPk(usuario)
    var puntos = dataUsuario.copas + 30
    const dataUpdate = await Usuario.update({copas: puntos}, {
      where: { username: usuario }
    })
    console.log(dataUpdate)
    res.status(200).send({jugador: usuario, copas: puntos})
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error sumando copas'});
  }
}

exports.perderPartida = async (req,res) => {
  try {
    var puntos = 0;
    const usuario = req.params.username
    const dataUsuario = await Usuario.findByPk(usuario)
    if (dataUsuario.copas >= 15){
      puntos = dataUsuario.copas - 15
    }else{
      puntos = 0
    }
    const dataUpdate = await Usuario.update({copas: puntos}, {
      where: { username: usuario }
    })
    console.log(dataUpdate)
    res.status(200).send({jugador: usuario, copas: puntos})
  }catch(err){
    return res.status(500).send({ message: err | 'se ha producido un error restando copas'});
  }
}

// Actualiza un usuario
exports.update = (req, res) => {
  const n_usuario = req.params.username;
  if (req.body.password !== undefined){
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }
  console.log('req', req.body)
  if (!req.body.password){
    req.body.password = undefined
  }
  Usuario.update(req.body, {
      where: { username: n_usuario }
  })
  .then(num => {
      if (num == 1) {
        res.send("usuario actualizado.");
      } else {
        res.send(`No se puede actualizar el usuario con id: ${n_usuario}.`);
      }
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || `Error actualizando usuario con id: + ${n_usuario}`});
  });
};

// Elimina un usuario
exports.delete = (req, res) => {
    const n_usuario = req.params.username;

    Usuario.destroy({
      where: { username: n_usuario }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                status: "Eliminado"
            });
        } else {
            res.send({
                status:  `No se puede eliminar el usuario con id: ${n_usuario}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error eliminando el usuario con id: " + n_usuario
        });
    });
};

// Elimina todos usuario
exports.deleteAll = (req, res) => {
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
  };