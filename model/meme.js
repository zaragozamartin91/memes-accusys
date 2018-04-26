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

exports.count = function () {
    return dbManager.queryPromise('SELECT count(id) FROM memes', []);
};

exports.find = function ({ page = 0, all = true, pageSize = 10 }) {
    if (all) return dbManager.queryPromise(`SELECT * FROM memes`, []);

    return exports.count().then(([data]) => {
        const c = data.count;
        const maxId = c - page * pageSize;
        console.log({ c, page, maxId, pageSize });
        const sql = `SELECT * FROM memes WHERE id <= $1 order by id desc limit $2`;
        return dbManager.queryPromise(sql, [maxId, pageSize]);
    });
};
