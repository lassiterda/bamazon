
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

// const questions = require('./questions.json');

const shop = function(objCust) {
  return connection.queryAsync("SELECT id, product_name, price FROM products")
    .then(function(res) {
      return inquirer.prompt([
        {
          type: "list",
          name: "selection",
          message: "Select a product (number): ",
          choices: res.map(function(ele) { return ele.product_name + ", $" + ele.price}),
          filter: function(input) {
            return res.filter(function(ele) {return ele.product_name == input.split(',')[0]})[0]
          }
        },
        {
          type: "input",
          name: "quantity",
          message:  "Quantity: ",
          filter: function(input) { return parseInt(input) },
          validate: function(input) {
            return (!isNaN(input) && input > 0) ? true : "Please enter a positive number"
          },
        }
      ]).then(function(a) {
        return connection.queryAsync("SELECT stock_quantity, price, id FROM products WHERE id = ?",[a.selection.id]).then(function(res) {
          if (res[0].stock_quantity - a.quantity > 0) {

            objCust.cart.push({ product: a.selection ,quantity: a.quantity })
            objCust.transactions.push(
              {status: 'success',
              message:  "Success, " + a.quantity + "x " + a.selection.product_name +  " ($" + a.quantity * a.selection.price + ") were added to your cart. \n",
              product: a.selection,
              quantity: a.quantity
              })
            objCust.total += a.selection.price * a.quantity;
          }
          else {
            objCust.transactions.push(
              {status: 'failure',
              message: "Whoops, looks like we dont have enough " + a.selection.product_name + " right now. please select " + res[0].stock_quantity + " or less. \n",
              product: a.selection,
              quantity: a.quantity
            })
          }
          return objCust;
        })
      })
  })
}


module.exports = {
 shop: shop
}
