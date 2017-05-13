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

const viewProducts =  function() {
  return connection.queryAsync("SELECT id, product_name, price, stock_quantity FROM products")
  .then(function(res) {
      return res.map(function(ele) {return "     " + ele.product_name + ", $" + ele.price + " -- id: " + ele.id + " | stock: " + ele.stock_quantity })
  })
}

const viewLowInventory = function() {
  return connection.queryAsync("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity <= 5")
  .then(function(res) {
      return res.map(function(ele) {return "     " + ele.product_name + ", $" + ele.price + " -- id: " + ele.id + " | stock: " + ele.stock_quantity })
  })
}

const addInventory = function() {
  return connection.queryAsync("SELECT id, product_name, price, stock_quantity FROM products").then((res) => {
    console.log("");
    res.forEach(function(ele) {
      console.log("     " + ele.product_name + ", $" + ele.price + " -- id: " + ele.id + " | stock: " + ele.stock_quantity) })
    console.log("");
      return inquirer.prompt([
        {
          name: "product",
          type: "input",
          message: "Product Id:",
          filter: function(input) {
            return res.find(ele => ele.id === parseInt(input))
          },
          validate: function(input) {
            return res.find(ele => ele.id === parseInt(input.id)) != undefined || "Please enter a valid product Id from the list above"
          }
        },
        {
          name: "amountToAdd",
          type: "input",
          message: "amount to Add: ",
          filter: function(input) {
            return parseInt(input);
          },
          validate: function(input) {
            return (!isNaN(input) && input > 0 )|| "Please enter a positive number"}
        }
      ]).then(function(a) {
        return connection.queryAsync("UPDATE products set stock_quantity = ? WHERE id = ?", [a.amountToAdd + a.product.stock_quantity, a.product.id]).then(function() {
          return "\n Success, stock increased by " + a.amountToAdd + "\n"
        })
      })
  })
};

const addNewProduct = function() {
  return inquirer.prompt([
    {
      name: "product_name",
      type: "input",
      message: "Product Name: "
    },
    {
      name: "department_name",
      type: "input",
      message: "Department: "
    },
    {
      name: "price",
      type: "input",
      message: "Price Per Item: ",
      filter: function(input) {
        return parseInt(input);
      },
      validate: function(input) {
        return (!isNaN(input) && input > 0 ) || "Please enter a positive number"
      }
    },
    {
      name: "stock_quantity",
      type: "input",
      message: "Stock: ",
      filter: function(input) {
        return parseInt(input);
      },
      validate: function(input) {
        return (!isNaN(input) && input > 0 ) || "Please enter a positive number"
      }
    },
  ]).then(function(a) {
    return connection.queryAsync("INSERT INTO products SET ?",a).then(function(res) {
      return "Success. " + a.product_name + " are available for purchase."
    })
  })
}


 module.exports = {
  viewProducts: viewProducts,
  viewLowInventory: viewLowInventory,
  addInventory: addInventory,
  addNewProduct: addNewProduct
}
