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


console.log(process.argv[1]);
if (process.argv[1].endsWith('meme.js')) {
  exports.createTable().then(e => {
    console.log('tabla creada');
  })
}