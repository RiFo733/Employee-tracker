var util = require("util");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employees_db"
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;