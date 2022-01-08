const ipInfo = require('ipinfo');

async function getIP() {
  const ip = await new Promise((resolve, reject) => {
    ipInfo((err, cLoc) => {
      if (err) reject(err);
      resolve(cLoc.ip);
    });
  });

  return ip;
}

module.exports = getIP;
