const sql = require('mssql');

const config = {
  user: "sa",
  password: "password",
  database: "ShippingRates_DB",
  server: 'SANDUNS-ZENBOOK\\SQLEXPRESS',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed: ', err);
  });

module.exports = {
  sql,
  poolPromise
};
