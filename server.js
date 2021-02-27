const mysql = require('mysql');
const inquirer = require('inquirer');

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

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    

});
let staffList = [];

const getManager = () => {
    connection.query ('Select id, first_name, last_name FROM employees', (err, res) => {
        if (err) throw err;
        let fullName = '';
        res.forEach((staff) => {
            fullname = staff.first_name.concat(' ', staff.last_name)
            staffList.push(fullname)
        })
    })
}

const addPerson = () => {getManager()
    roleList = ['Sales Lead', 'Salesperson', 'Lead Engineer',
    'Software Engineer', 'Accountant', 'Legal Team Lead',
    'Lawyer']    
    if (staffList.length < 1) {
        staffList.push('No manager to assign, press "Enter" to continue')
    }
    inquirer.prompt ([{
        name: 'first_name',
        message: 'Please enter first name'
    },{
        name:'last_name',
        message: 'Please enter last name'
    },
    {
        name:'role',
        message: 'What is the employee&apos;s role',
        type: 'list',
        choices: roleList,
    },
    {
        name: 'manager',
        message: 'Please select the employee&apos;s manager:',
        choices: staffList,
        type: 'list'
    }
]).then((result) => {

    let roleIndex = 0;
    for(i=0; i<roleList.length; i++) {
        if (roleList[i] === result.role ) {
            roleIndex = i+1;
        }
        console.log(roleList[i])
        console.log(result.role)
        console.log(i)
        console.log('-----------------------------')
    }
    let managerIndex = 0;
    if (staffList.length === 1) {
        managerIndex = null;
    } 
    else {
        for(i=0; i<staffList.length; i++) {
            if (staffList[i] === result.manager ) {
                managerIndex = i;
            }
        }
    }
    let query = 'INSERT INTO employees SET ?';
    console.log(result);
    console.log(roleIndex);
    connection.query(query,
        {
        first_name: result.first_name,
        last_name: result.last_name,
        role_id: roleIndex,
        manager_id: managerIndex,
    },
        (err, res) => {
            if (err) throw err;
            
        }
    )
    

        // connection.query('INSERT INTO employees SET ? WHERE ?',
        //     {
        //         role_id:
        //     })
        connection.end();

    
})
}


addPerson();


