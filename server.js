// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username
    user: 'root',
    // Add your MySQL password here
    password: 'limon',
    database: 'company_DB'
  },
  console.log(`Connected to the company_db database.`)
);

// todo: write out function
function queryTitles();

function menu() {
    inquirer.prompt (
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a Department", "Add a role", "Add an Employee", "Update an Employee Role", "Exit"]
        }
    ).then(
        function(data) {
            console.log(data);
            if(data.menu === "View all departments") {
                viewAllDepartments();
            } else if (data.menu === "View all roles") {
                viewAllRoles();
            } else if (data.menu === "View all employees") {
                viewAllEmployees();
            } else if (data.menu === "Add a Department") {
                addDepartments();
            } else if (data.menu === "Add a role") {
                addRole();
            } else if (data.menu === "Add an Employee") {
                addEmployee();
            } else if (data.menu === "Update an Employee Role") {
                updateEmployeeRole();
            } else {
                db.end();
            }
        }
    )
}

menu();

function viewAllDepartments() {
    db.query("SELECT department.id AS `Department id`, name_department AS `Department Name` FROM department", (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

function viewAllRoles() {
    db.query("SELECT role.id AS `Role id`, role.title AS `Job Title`, role.salary AS `Salary`, department.name_department AS `Department Name` FROM role INNER JOIN department ON role.department_id = department.id", (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

function viewAllEmployees() {
    const query = `
        SELECT employee.id AS 'Employee ID',
               employee.first_name AS 'First Name',
               employee.last_name AS 'Last Name',
               role.title AS 'Job Title',
               department.name_department AS 'Department Name',
               CONCAT(m.first_name, ' ', m.last_name) AS 'Manager Name'
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON employee.manager_id = m.id`;

    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}


function addDepartments() {
    inquirer.prompt({
        type: "input",
        name: "name_department",
        message: "What is the new department name?"
    }).then(
        function(data) {
            db.query("INSERT INTO department(name_department) VALUES(?)", data.name_department,(err, results)=> {
                if (err) throw err;
                console.log("New department has been added");
                menu();
            });
        }
    );
    
}

// todo: refactor so there are choices with a list of deparments
function addRole() {
    inquirer.prompt([
        {
        type: "input",
        name: "title",
        message: "What is the title of the new role?"
        },
        {
        type: "input",
        name: "salary",
        message: "What is the new salary?"
        },
        {
        type: "input",
        name: "department_id",
        message: "What is the new department id?"
        }
        
    ]).then(
        function(data) {
            db.query(
                "INSERT INTO role(title, salary, department_id) VALUES(?,?,?)", 
                [data.title, data.salary, data.department_id],
                (err, results) => {
                    if (err) throw err;
                    console.log("A new role has been added");
                    menu();
                } 
            )
        } 
    )
}

// todo: continue working on this function for better UI
async function addEmployee() {
    const jobTitles = await queryTitles();
    inquirer.prompt([
        {
        type: "input",
        name: "first_name",
        message: "What's the first name of the new employee?"
        },
        {
        type: "input",
        name: "last_name",
        message: "What is the last name of the new employee?"
        },
        {
        type: "list",
        name: "role_id",
        message: "What is the role id of the new employee?",
        choices: jobTitles.map((job) => ({ name: job.title, value: job.id})),
        },
        {
        type: "input",
        name: "manager_id",
        message: "What is the manager id of the new employee?"
        } 
    ]).then(
        function(data) {
            db.query(
                "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", 
                [data.first_name, data.last_name, data.role_id, data.manager_id],
                (err, results) => {
                    if (err) throw err;
                    console.log("A new employee has been added");
                    menu();
                } 
            )
        } 
    )
}


// function updateEmployeeRole() {
//     const employeePromise = db.promise().query("SELECT * FROM employee");
//     const rolesPromise = db.promise().query("SELECT * FROM role");
//     Promise.all([employeePromise, rolesPromise])
//       .then(([allEmployees, allRoles]) => {
//         let employeeChoices = allEmployees[0].map(({ id, first_name, last_name }) =>
//           ({
//             name: first_name + " " + last_name,
//             value: id,
//           })
//         );
//         let roleChoices = allRoles[0].map(({ id, title }) =>
//           ({
//             name: title,
//             value: id,
//           })
//         );
//         return inquirer.prompt([
//           {
//             type: "list",
//             name: "id",
//             message: "Select which employee is being updated",
//             choices: employeeChoices
//           },
//           {
//             type: "list",
//             name: "role_id",
//             message: "Select the employee's new role",
//             choices: roleChoices
//           }
//         ]);
//       })
//       .then(updateAnswers => {
//         const sql = "UPDATE employee SET role_id = ? WHERE id = ?";
//         const params = [updateAnswers.role_id, updateAnswers.id];
//         db.query(sql, params, (err, results) => {
//           if (err) {
//             console.log(err);
//           }
//           console.log(`Employee role has been updated`);
//           menu();
//         });
//       })
//       .catch(err => {
//         console.log(err);
//       });
      
//   }
  