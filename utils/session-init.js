/* 
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
*/

const dbManager = require('../model/db-manager');

exports.initialize = function () {
    let tableExists = undefined;
    const sql = `SELECT exists (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session');`;
    return dbManager.queryPromise(sql, [])
        .then(([{ exists }]) => {
            tableExists = exists;
            if (exists) return Promise.resolve(true);
            else return dbManager.queryPromise(`CREATE TABLE IF NOT EXISTS session (
                sid varchar NOT NULL COLLATE "default",
                sess json NOT NULL,
                expire timestamp(6) NOT NULL
              )
              WITH (OIDS=FALSE)`, []);
        }).then(() => {
            if (tableExists) return Promise.resolve(true);
            else return dbManager.queryPromise(`ALTER TABLE "session" 
                ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") 
                NOT DEFERRABLE INITIALLY IMMEDIATE`, []);
        })
        .catch(console.error)
};


