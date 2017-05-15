const inquirer = require('inquirer');
const Promise = require("bluebird");
const mysql = require('mysql');
const manager = require('./bamazon-manager.js');
const customer = require('./bamazon-customer.js');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

require('dotenv').config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: process.env.password,
  database: "bamazon_db",
});

const authenticate = function() {
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
          return authenticate()}
      })
  })
};

const promptAdmin = function(arrUser) {
   inquirer.prompt([
    {
      name: "managerCmd",
      type: "list",
      message: "Select a function: ",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
      when: function(i) {
        return arrUser[0].userType === "manager"
      }
    },
    {
        name: "supervisorCmd",
        type: "list",
        message: "Select a function: ",
        choices: ["View Product Sales by Department","Create New Department","Exit"],
        when: function(i) {
          return arrUser[0].userType === "supervisor"
        }
    }
  ]).then(function(a) {
      if(a.managerCmd) {
        switch ( a.managerCmd) {
          case "View Products for Sale":
            manager.viewProducts().then((res) => {
              console.log("");
              res.forEach(function(ele) { console.log(ele)})
              console.log("");
              promptAdmin(arrUser);
            })
          break;
          case "View Low Inventory":
            manager.viewLowInventory().then((res) => {
              console.log("Low Inventory:");
              res.forEach(function(ele) { console.log(ele)})
              console.log("");
              promptAdmin(arrUser);
            })
          break;
          case "Add to Inventory":
            manager.addInventory().then((res) => {
              console.log(res);
              promptAdmin(arrUser)
            })
          break;
          case "Add New Product":
            manager.addNewProduct().then((res) => {
              console.log(res);
              promptAdmin(arrUser);
            })
          break;
          case "Exit":
            console.log(" \n Goodbye.");
            process.exit(0);
          break;
          default:
            console.log("\n Invalid Command, please try again.");
            promptAdmin(arrUser);
          break;
        }
      }
      else if (a.supervisorCmd){
        switch ( a.supervisorCmd) {

        }
      }
      else {
        console.log("Something went wrong...Please try again");
        promptAdmin(arrUser);
      }
  })
}

const promptUser = function(objCust) {
  //could also user a simple constcutor here, but its a very simple object a ton of data.
  Cust = objCust ? objCust : { total: 0, transactions: [], cart: []};
  inquirer.prompt([
    {
      name: "customerCmd",
      type: "list",
      message: "Select an Action: \n",
      choices: ["Shop", "View Cart", "Checkout", "Exit"]
    }
  ]).then(function(a) {
    switch(a.customerCmd) {
      case "Shop":
        customer.shop(Cust).then(function(res) {
          console.log(res.transactions[res.transactions.length - 1].message);
          promptUser(res);
        })
      break;
      case "View Cart":
        //NOTE:  ViewCart does not return  modified version of the Customer's session object,
        //       when calling promptUser, make sure to use the existing 'Cust' Object
        console.log(customer.viewCart(Cust));
        promptUser(Cust);
      break;
      case "Checkout":
        customer.checkout(Cust).then(function(res) {

        })
      break;
      case "Exit":
        console.log(" \n Thanks for shopping, come again!");
        process.exit(0);
      break;
      default:
        console.log("Something went wrong...Please try again");
        promptUser(Cust);
      break;
    }
  })
}

module.exports = {
  authenticate: authenticate,
  promptAdmin: promptAdmin,
  promptUser: promptUser
};
