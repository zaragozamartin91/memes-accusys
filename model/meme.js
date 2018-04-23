const User = require('./user');
const dbManager = require('./db-manager');

exports.createTable = function () {
  const sql = `CREATE TABLE memes(
    id SERIAL PRIMARY KEY,
    usr ${User.idType} REFERENCES ${User.table}(id) ON DELETE SET NULL,
    title VARCHAR(32),
    img VARCHAR(128)
  )`;
  return dbManager.queryPromise(sql, []);
};

exports.insert = function ({ usr, title, img }) {
  const sql = `INSERT INTO memes(usr,title,img) VALUES($1,$2,$3) RETURNING *`;
  return dbManager.queryPromise(sql, [usr, title, img]);
};

exports.find = function() {
  return dbManager.queryPromise(`SELECT * FROM memes`, []);
};

console.log(process.argv[1]);
if (process.argv[1].endsWith('meme.js')) {
  exports.createTable().then(e => {
    console.log('tabla creada');
  })
}