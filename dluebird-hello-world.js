const Promise = require("bluebird");
const mysql = require('mysql');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);


const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: "lassiterda",
  database: "bamazon_db",
});

connection.queryAsync("SELECT id, product_name, price FROM products").then((res) => {
  console.log(res);
  console.log("returned");
})
