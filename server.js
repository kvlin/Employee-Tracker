const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
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
    
    init();
});
const staffList = ['None'];
// Obtain all staff for manager array
const getStaff = () => {
    connection.query ('Select id, first_name, last_name FROM employees', (err, res) => {
        if (err) throw err;
        staffList.splice(1);
        for(i=0; i<res.length; i++){
            staffList.push( res[i].first_name.concat(' ', res[i].last_name))
        }
    })
}
// Task List: Add a staff
const addStaff = () => {
    getStaff()
    roleList = ['Sales Lead', 'Salesperson', 'Lead Engineer',
    'Software Engineer', 'Accountant', 'Legal Team Lead',
    'Lawyer']    
    inquirer.prompt ([{
        name: 'first_name',
        message: 'Please enter first name:'
    },{
        name:'last_name',
        message: 'Please enter last name:'
    },
    {
        name:'role',
        message: "What is the employee's role?",
        type: 'list',
        choices: roleList,
    },
    {
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: staffList,
        type: 'list'
    }
]).then((result) => {
    // Get role id for the corresponding role selected
        let roleIndex = 0;
        for(i=0; i<roleList.length; i++) {
            if (roleList[i] === result.role ) {
                roleIndex = i+1;
            }
        }
            // Get staff's id for the corresponding manager selected
            let managerIndex = 0;
            // If no staff names available to choose, return null
            for (i=0; i<staffList.length; i++) {
                if (result.manager === staffList[0]) {
                managerIndex = null;
                } else if (result.manager === staffList[i]) {
                    managerIndex = i;
                }
            }
            console.log('manager index to insert', managerIndex)
            console.log('staff list before query insert', staffList)
            console.log("manager:", result.manager)
            console.log(result.first_name)
            // Query to add a new row with the new staff's details
            let query = 'INSERT INTO employees SET ?';
            // query += ` UPDATE employees SET manager = CONCAT(employees.first_name, ' ',  employees.last_name) WHERE id =  ${roleIndex} `
            connection.query(query,
               {
                first_name: result.first_name,
                last_name: result.last_name,
                role_id: roleIndex,
                manager_id: managerIndex,
                manager: result.manager
                },
            
                (err, res) => {
                    if (err) throw err;    
                }
            ),
          
            root()
        }
    )
}      




// Task List: View all employees
const viewAll = () => {
    let query =
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, department.dep_name, employees.manager  `
    query += `FROM employees `
    query += `JOIN roles ON employees.role_id=roles.id `


    query += `LEFT JOIN department ON department.id = roles.department_id; `
    
    connection.query (query,
  
    (err, res) => {
        if (err) throw err;
        console.table('From View',res)
        console.log(res[0].first_name),
        root()
    }
    
    )
    
}

// Task List: update employees role.
const updateRole = () => {
    getStaff()
    roleList = ['Sales Lead', 'Salesperson', 'Lead Engineer',
    'Software Engineer', 'Accountant', 'Legal Team Lead',
    'Lawyer']   

    setTimeout(function(){
        inquirer.prompt ([
        {
            name: 'staff',
            message: "Who's role would you like to update?",
            choices: staffList,
            type: 'list'
        },
        {
            name: 'new_role',
            message: 'What is the new role',
            choices: roleList,
            type: 'list'
        }
        ]).then ((result) => {
            let roleIndex = 0;
        for(i=0; i<roleList.length; i++) {
            if (roleList[i] === result.new_role ) {
                roleIndex = i+1;
            }
        }
        
        let staffID = staffList.indexOf(result.staff)
        
        const query = connection.query(
        'UPDATE employees SET role_id = ? WHERE id = ?',
        [
            roleIndex,
            staffID
        ],
        (err, res) => {
            if (err) throw err;
            console.log('sucess')
        }, root()
        );
    
        // logs the actual query being run
        console.log(query.sql)
        });
    },30);
    
};
  
// List of tasks that the application can do
const taskList = ['Exit the application', 'Add a staff', 'View all employees', 'Update employee roles']

// Root inquirer questions asking the use what would like to do next.
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
//Root inquirer
init = () => {
    root();
}   





