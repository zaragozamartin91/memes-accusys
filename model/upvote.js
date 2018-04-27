const dbManager = require('./db-manager');

const Meme = require('./meme');
const User = require('./user');

exports.createTable = function () {
  const sql = `CREATE TABLE upvotes(
    id SERIAL PRIMARY KEY,
    usr ${User.idType} REFERENCES ${User.table}(id) ON DELETE SET NULL,
    meme ${Meme.idType} REFERENCES ${Meme.table}(id) ON DELETE SET NULL,
    UNIQUE (usr, meme)
  )`;
  return dbManager.queryPromise(sql, []);
};

exports.insert = function ({ usr, meme }) {
  const sql = `INSERT INTO upvotes(usr,meme) VALUES($1,$2) RETURNING *`;
  return dbManager.queryPromise(sql, [usr, meme]);
};

exports.count = function ({ meme = 0 }) {
  if (meme) return dbManager.queryPromise('SELECT count(id) FROM upvotes WHERE meme=$1', [meme]);
  else return dbManager.queryPromise('SELECT count(id) FROM upvotes', []);
};

exports.countAll = function ({ memes = [] }) {
  if (memes.length > 0) {
    const str = JSON.stringify(memes.map(m => m.id)).replace('[', '(').replace(']', ')');
    return dbManager.queryPromise(`SELECT meme,count(meme) FROM upvotes WHERE meme in ${str} GROUP BY meme`, []);
  } else {
    return dbManager.queryPromise('SELECT meme,count(meme) FROM upvotes GROUP BY meme', []);
  }
};

exports.populate = function ({ memes = [] }) {
  return exports.countAll({ memes }).then(upvotes => {
    memes.forEach(meme => {
      const upvote = upvotes.find(u => u.meme == meme.id);
      if (upvote) meme.upvotes = upvote.count;
      else meme.upvotes = 0;
    });
    return memes;
  });
};