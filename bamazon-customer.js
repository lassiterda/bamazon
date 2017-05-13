
const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: process.env.password,
  database: "bamazon_db",
});

// const questions = require('./questions.json');
module.exports.shop = function() {

  connection.query(("SELECT id, product_name, price FROM products"),(err, res) => {
    if(err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "selection",
        message: "Select a product (number): ",
        choices: res.map(function(ele) { return ele.product_name + ", $" + ele.price})
      },
      {
        type: "input",
        name: "quantity",
        message:  "Quantity: ",
        validate: function(input) {
          return (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : "Please enter a positive number"
        }
      }
    ]).then(function(a) {
        selectionName = a.selection.split(',')[0];

        connection.query("SELECT stock_quantity, price, id FROM products WHERE product_name = ?",selectionName,function(err, res) {
          if(err) throw err;
          if (res[0].stock_quantity - parseInt(a.quantity) > 0) {

            connection.query("UPDATE products SET stock_quantity = ? WHERE id= ?",
              [res[0].stock_quantity - parseInt(a.quantity),res[0].id],function(){
                if (err) throw err;
                console.log("Success, your total is $" + parseInt(a.quantity) * res[0].price);
                process.exit(0)
            })
          }
          else {
            console.log("Whoops, looks like we dont have enough " + selectionName + " right now.");
            process.exit(0)
          }
        })
    })
  })
};
