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


//manager.viewProducts - pull items in products table return them to be logged

//manager.viewLowInventory - SELECT name and stock of all items where stock_quantity <= 5, to be returned and logged. 
