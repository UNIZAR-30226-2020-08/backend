const db = require("../models");
const FotoPerfil = db.foto_perfil;
const Customizable = db.customizable;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const customizable = {
    imagen: req.body.f_perfil,
  };
  Customizable.create(customizable)
  .then(dataCustom => {
    const foto_perfil = {
      f_perfil: req.body.f_perfil,
    };
    FotoPerfil.create(foto_perfil)
      .then(dataPerfil => {
        res.send({dataCustom,dataPerfil});
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error creando foto_perfil"
        });
      });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error creando customizable"
    });
  });  
};
    
exports.findAll = (req, res) => {
  FotoPerfil.findAll()
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error recuperando fotos_perfil."
    });
  });
};
    
exports.find = (req, res) => {
    const foto_perfil = req.body.f_perfil;
    FotoPerfil.findByPk(foto_perfil)
    .then(data => {
        res.send({data});
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Error recuperando foto_perfil: " + foto_perfil
        });
    });
  };

//No se va a usar
exports.update = (req, res) => {
    const foto_perfil = req.body.foto_perfil;
    FotoPerfil.update(req.body, {
      where: { foto_perfil: foto_perfil }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "foto_perfil actualizada."
          });
      } else {
          res.send({
              message: `No se puede actualizar la foto_perfil: ${foto_perfil}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error actualizando la carta: " + foto_perfil
      });
  });
};
    
exports.delete = (req, res) => {
    const f_perfil = req.body.f_perfil;
    FotoPerfil.destroy({
      where: { f_perfil: f_perfil }
    })
    .then(num => {
      Customizable.destroy({
        where: { imagen: f_perfil }
      })
      .then(num => {
        res.send({ status: "Eliminado customizable" });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || `Error eliminando el customizable:  ${f_perfil}.` });
      });
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || `Error eliminando la foto_perfil: ${f_perfil}.` });
    });
};

exports.deleteAll = (req, res) => {
  FotoPerfil.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} fotos_perfil eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando fotos_perfil."
      });
    });
};