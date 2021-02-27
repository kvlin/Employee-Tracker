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
// Task List: Add a staff
const addStaff = () => {
    getManager()
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
            // Query to add a new row with the new staff's details
            let query = 'INSERT INTO employees SET ?';
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
            ),
            query =`UPDATE employees SET manager = CONCAT(employees.first_name, ' ',  employees.last_name) where  ?;`
            connection.query(query,
                {
                    id:roleIndex
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
    let query = "SELECT e1.id, e1.first_name, e1.last_name, e1.manager_id, roles.title, roles.salary, department.name, e2.manager FROM employees as e1 JOIN roles ON e1.role_id=roles.id LEFT JOIN employees as e2 ON e1.id = e2.manager_id LEFT JOIN department ON department.id = roles.department_id; select * from employees;"

    connection.query (query,
    // console.table (
    //     {
    //         name: 'foo',
    //         age: 10
    //       }, {
    //         name: 'bar',
    //         age: 20
    //       }
    // )),
    (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log(res[0].first_name),
        root()
    }
    
    )
    
}


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





