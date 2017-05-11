const inquirer = require('inquirer');
const Promise = require("bluebird");
const mysql = require('mysql');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);;

require('dotenv').config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: process.env.password,
  database: "bamazon_db",
});

module.exports.authenticate = function() {
  return inquirer.prompt([
    {
      name: "username",
      type: "input",
      message: "Username: ",
    },
    {
      name: "password",
      type: "password",
      message: "Password: ",
    }
  ]).then(function(a) {
    return connection.queryAsync("SELECT * FROM users WHERE username = ? AND pass = ?", [a.username, a.password])
      .then(function(res) {
        if( res.length > 0 ) {return res }
        else { console.log("username/password incorrect");
          return user.authenticate()}
      })
  })
};
