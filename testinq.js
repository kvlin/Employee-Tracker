const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const taskList = ['Exit the application', 'Add a staff', 'View all employees', 'Update employee roles']
const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'Mypassword',
    database: 'employee_db',
  });
  
  
const root = () => {
    inquirer.prompt ([
        {
        name: 'task',
        message: 'What would you like to do:',
        choices: taskList,
        type: 'list'
        }
    ]).then ((response) => {
        console.log(response.task)
        switch (response.task) {
            case 'Exit the application':
                connection.end()
                break;
            case 'Add a staff':
                addStaff()
                break;
            case 'View all employees':
                viewAll()
                break;
            case 'Update employee roles':
                updateRole()
                break;
        }
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    
    root()
});