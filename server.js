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
  password: 'pw',
  database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    init();
});
const staffList = ['None'];
const depList = ['None'];
const roleList = []
// Obtain all staff for manager array
const getStaff = () => {
    staffList.length = 0;
    staffList.push("None")
    connection.query ('Select id, first_name, last_name FROM employees', (err, res) => {
        if (err) throw err;
        staffList.splice(1);
        for(i=0; i<res.length; i++){
            staffList.push( res[i].first_name.concat(' ', res[i].last_name))
        }
        return staffList;
    })
}
// Obtain all roles for role array
const getRole = () => {
    roleList.length = 0;
    connection.query ('Select title FROM roles', (err, res) => {
        if (err) throw err;
        roleList.splice(1);
        for(i=0; i<res.length; i++){
            roleList.push(res[i].title)
        }
        return roleList;
    })
}
// Obtain all departments for department array
const getDepartment = () => {
    connection.query ('Select dep_name FROM department', (err, res) => {
        if (err) throw err;
        depList.splice(1);
        for(i=0; i<res.length; i++){
            depList.push( res[i].dep_name)
        }
    })
}
// Task List: Add a staff
const addStaff = () => {
    getStaff()   
    getRole()
    setTimeout(function(){
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
                manager: result.manager
                },
            
                (err, res) => {
                    if (err) throw err; 
                     
                }
            ),
            console.log(result.first_name,'',result.last_name, ' is now added to the list!' ),
            root()
        }
    ), 30})
}      
// Add department
const addDepartment = () => { 
    inquirer.prompt ([
    {
        name: 'new_Department',
        message: 'Please enter the name of the new department:'
    }
]).then((result) => {
             // Query to add a new row with the new staff's details
            let query = 'INSERT INTO department SET ?';
            connection.query(query,
               {
                dep_name:result.new_Department
                },
            
                (err, res) => {
                    if (err) throw err; 
                }
            ),
            console.log('Successfully added', result.new_Department, "department!" ),
            root()
        }
    )
}

// Add role
const addRole = () => {
    getDepartment() 
    setTimeout(function(){
    inquirer.prompt ([
    {
        name: 'title',
        message: 'Please enter role title:'
    },{
        name:'department',
        message: "Which department does it belongs to?",
        type: 'list',
        choices: depList,
    },
    {
        name:'salary',
        message: 'Please enter the salary for the role:'
    }
]).then((result) => {
            // Get staff's id for the corresponding manager selected
            let depIndex = 0;
            // If no staff names available to choose, return null
            for (i=0; i<depList.length; i++) {
                if (result.department === depList[0]) {
                depIndex = null;
                } else if (result.department === depList[i]) {
                    depIndex = i;
                }
            }
    
            // Query to add a new row with the new staff's details
            let query = 'INSERT INTO roles SET ?';
            connection.query(query,
               {
                title: result.title,
                salary: result.salary,
                department_id: depIndex,
                },
            
                (err, res) => {
                    if (err) throw err; 
                     
                }
            ),
            console.log(`New role "${result.title}" added!`),
            root()
        }
    ), 30});
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
        console.table(res);
        root()
    }
    
    )
    
}


// Task List: update employees role.
const updateRole = () => {
    staffList.length = 0;
    getStaff()
    getRole()
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
        let staffID = staffList.indexOf(result.staff);
        const query = connection.query(
        'UPDATE employees SET role_id = ? WHERE id = ?',
        [
            roleIndex,
            staffID
        ],
        (err, res) => {
            if (err) throw err;
            console.log('Role successfully updated!')
        }, root()
        );
    
        });
    },300);
    
};
// View all roles
const viewRoles = () => {
    let query =
        `Select * FROM roles`
    connection.query (query,
  
    (err, res) => {
        if (err) throw err;
        console.table(res);
        root()
    }
    
    )
}

// View all departments
const viewDepartments = () => {
    let query =
        `Select * FROM department`
    connection.query (query,
  
    (err, res) => {
        if (err) throw err;
        console.table(res);
        root()
    }
    
    )
}
// List of tasks that the application can do
const taskList = ['Exit the application', 'Add new staff', 'Add new role', 'Add new department','View all staffs', 'View all roles', 'View all departments', 'Update staff roles']

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
        switch (response.task) {
            case 'Exit the application':
                connection.end()
                break;
            case 'Add new staff':
                addStaff()
                break;
            case 'View all staffs':
                viewAll()
                break;
            case 'Update staff roles':
                updateRole()
                break;
            case 'Add new role':
                addRole()
                break;
            case 'Add new department':
                addDepartment()
                break;
            case 'View all roles':
                viewRoles()
                break;  
            case 'View all departments':
                viewDepartments()
                break;             
        }
    })
}
//Root inquirer
init = () => {
    root();
}   





