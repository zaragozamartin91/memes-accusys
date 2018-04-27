const dbManager = require('./db-manager');
const encryptor = require('../utils/encryptor');

const table = 'users';
const idType = 'int'; // el tipo SERIAL puede verse como int 

exports.table = table;
exports.idType = idType;

exports.createTable = function () {
    const sql = `CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(32),
    name VARCHAR(64),
    avatarimg VARCHAR(128) DEFAULT 'avatar.jpg',
    password VARCHAR(64),
    description VARCHAR(128) DEFAULT ''
  )`;
    return dbManager.queryPromise(sql, []);
};

exports.insert = function (obj) {
    const { username, name, avatarimg, password, description = 'Miembro de accoses', encPassw = encryptor.encrypt(password) } = obj;
    const sql = `INSERT INTO ${table}(username , name , avatarimg , password , description) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    return dbManager.queryPromise(sql, [username, name, avatarimg, encPassw, description]);
};

exports.find = function () {
    return dbManager.queryPromise(`SELECT * FROM ${table}`, []);
};

exports.findById = function (uid) {
    const sql = `SELECT * FROM ${table} WHERE id=$1`;
    const values = [uid];
    return dbManager.queryPromise(sql, values);
};

exports.findByUsername = function (username) {
    const sql = `SELECT * FROM ${table} WHERE username=$1`;
    const values = [username];
    return dbManager.queryPromise(sql, values);
};

exports.validate = function (user, password) {
    return encryptor.verify(user.password, password);
};
