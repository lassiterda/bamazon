
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
        user.authenticate().then(user.promptAdmin)
      break;

      default:
        console.log("Valid commands are 'Shop' or 'Login'");
      break;
    }
  })
}

appInit()
