/*Proyecto:     NeoB
//Fecha:        noviembre-2020
//Autores:      Aarón Ibáñez Espés 779088, Pablo García García 781020, Arturo Calvera Tonin 776303
//Módulo:       Back-end del sistema de información del proyecto NeoB
//Fichero:      auth.config.js
//Descripción:  Archivo con parámetros de configuración para la autenticación de usuarios  */

module.exports = {
    secret: process.env.AUTH_SECRET || "C0ntra5enya-s3creta-t0ken",
    secretTokenStr: process.env.AUTH_TOKEN || "auTh-Token-sTr726445"
};