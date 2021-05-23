const db = require("../models");
const Participantes = db.participantes_torneo;
const Torneo = db.torneo;
const Usuario = db.usuario;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  try {
    const dataTorneo = await Torneo.findByPk(req.body.torneo)
    const dataPlayer = await Usuario.findByPk(req.body.jugador)
    if (dataTorneo === null | dataPlayer === null){
      res.status(500).send('El torneo o usuario no existen')
    }else{
      if (dataTorneo.contrasenya === 'NO'){
        var maxPermitidoPartida = (dataTorneo.tipo + 1)*dataTorneo.nparticipantes
        const dataP = await Participantes.findAndCountAll({where: { torneo: req.body.torneo }})
        if (dataP.count >= maxPermitidoPartida){
          res.status(500).send('El torneo esta completo')
        }else{
          const participantes_torneo = {
            torneo: req.body.torneo,
            jugador: req.body.jugador,
          }
          const dataParticipante = await Participantes.create(participantes_torneo)
          dataParticipante['message'] = 'JOIN'
          res.send(dataParticipante);
        }
      }else{
        var passwordIsValid = bcrypt.compareSync(req.body.contrasenya,dataTorneo.contrasenya);
        if (passwordIsValid === false) {
          return res.status(401).send({message: "Contrasenya incorrecta"});
        }else{
          const participantes_torneo = {
            torneo: req.body.torneo,
            jugador: req.body.jugador,
          }
          const dataParticipante = await Participantes.create(participantes_torneo)
          dataParticipante['message'] = 'JOIN'
          res.send(dataParticipante);
        }
      } 
    }
  }catch(err){
    return res.status(500).send({ message: err | 
      'se ha producido un error uniendose al torneo'});
  }
};

exports.findAll = async (req, res) => {
  const torneo = req.body.torneo;
  Participantes.findAll({ where: {torneo : torneo} })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error recuperando participantes_torneo."
    });
  });
};

exports.find = (req, res) => {
  const torneo = req.body.torneo;
  const jugador = req.body.jugador;
  Participantes.findAll({
    where: { torneo:torneo, jugador:jugador }
  })
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error recuperando participantes_torneo: " + participantes_torneo
      });
  });
};
//No se va a usar
exports.update = (req, res) => {
  const torneo = req.body.torneo;
  const jugador = req.body.jugador;
  Participantes.update(req.body, {
    where: { torneo:torneo, jugador:jugador }
  })
  .then(num => {
          res.send({ message: "participante_torneo actualizado." });
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || `Error actualizando el participante_torneo: ${participantes_torneo}.`
      });
  });
};

exports.delete = (req, res) => {
  const torneo = req.params.torneo;
  const jugador = req.params.jugador;
  Participantes.destroy({
    where: { torneo:torneo, jugador:jugador }
  })
  .then(num => {
    res.send({status: "Eliminado"});
  })
  .catch(err => {
      res.status(500).send({
          message: 
              err.message || "Error eliminando el participante_torneo: " + participantes_torneo });
  });
};
//No se va a usar
exports.deleteAll = (req, res) => {
  Participantes.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} participantes_torneo eliminadas.` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error eliminando participantes_torneo."
      });
    });
};