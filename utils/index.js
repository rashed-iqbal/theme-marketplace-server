const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");

const CRYPTO_SALT = process.env.CRYPTO_SALT;

const StatusError = (message, statusCode) => {
    let error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const PasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    return await bcrypt.hash(password, salt);
};

const EncryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTO_SALT).toString();
};

const DecryptData = (hash) => {
    return AES.decrypt(hash, CRYPTO_SALT).toString(CryptoJS.enc.Utf8);
};

module.exports = { StatusError, PasswordHash, EncryptData, DecryptData };
