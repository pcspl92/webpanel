const pool = require('../init/db');

module.exports = (sql) =>
  new Promise((resolve, reject) => {
    pool.getConnection((errConn, connection) => {
      if (errConn) {
        console.log(errConn);
        reject(errConn);
      }

      connection.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(JSON.parse(JSON.stringify(rows)));
        connection.release();
      });
    });
  });
