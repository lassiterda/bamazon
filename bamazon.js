
const inquirer = require('inquirer');

const user = require('./user.js');
const customer = require('./bamazon-customer.js');

// const manager = require('./bamazon-manager.js');
// const supervisor = require('./bamazon-supervisor.js');

const appInit = function() {
  inquirer.prompt([
    {
      name: "command",
      type: "list",
      message: "Welcome.  What would you like to do?",
      choices:  ["Shop", "Login"]
    }
  ]).then(function(a) {

    switch (a.command) {

      case "Shop":
        customer.shop();
      break;

      case "Login":
        user.authenticate().then(function(res) {
            return inquirer.prompt([
              {
                name: "managerCmd",
                type: "list",
                message: "Select a function: ",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                when: function(i) {
                  return res[0].userType === "manager",
                }
              },
              {
                  name: "supervisorCmd",
                  type: "list",
                  message: "Select a function: ",
                  choices: ["View Product Sales by Department","Create New Department"],
                  when: function(i) {
                    return res[0].userType === "supervisor"
                  }
              }
            ]).then(function(a) {

            })
        });
      break;

      default:
        console.log("Valid commands are 'Shop' or 'Login'");
      break;
    }
  })
}

appInit(process.argv[2])
