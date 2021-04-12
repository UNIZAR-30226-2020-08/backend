/*Proyecto:     NeoB
//Fecha:        noviembre-2020
//Autores:      Aarón Ibáñez Espés 779088, Pablo García García 781020, Arturo Calvera Tonin 776303
//Módulo:       Back-end del sistema de información del proyecto NeoB
//Fichero:      crypto.js
//Descripción:  Archivo con funciones para el encriptado y desencriptado de valores para la generación de URLs
                secretas. */

const crypto = require('crypto');
const algorithm = process.env.CRYPTO_ALGORITHM || 'aes-256-ctr';
const secretKey = process.env.CRYPTO_KEY || 'bf';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    const str1 = iv.toString('hex');
    const str2 = encrypted.toString('hex');
    return str1.concat("-").concat(str2);
};

const decrypt = (hash) => {

    const content = hash.split("-")[1]
    const iv = hash.split("-")[0]

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};