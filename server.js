// Imports and requires mysql2 and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connects to database
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

// function to query job titles(roles)
async function queryTitles() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM role", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// function to query employees
async function queryAllEmployees() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM employee", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// function to query departments
async function queryDepartments() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM department", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// displays main menu that will list options for user and based on their choices will call functions(all functions call menu() after displaying, adding, and updating - will not be called if user chooses 'Exit' option)
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
                newUpdateEmployee();
            } else {
                db.end();
            }
        }
    )
}

// starts the program
menu();

// views all departments 
function viewAllDepartments() {
    // queries and shows a table of all departments
    db.query("SELECT department.id AS `Department id`, name_department AS `Department Name` FROM department", (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

// views all job titles (roles)
function viewAllRoles() {
    // queries and shows a table of all job titles and department names they belong to
    db.query("SELECT role.id AS `Role id`, role.title AS `Job Title`, role.salary AS `Salary`, department.name_department AS `Department Name` FROM role INNER JOIN department ON role.department_id = department.id", (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

// view all employees
function viewAllEmployees() {
    // query that gets data about employees, their job titles(roles), departments, and managers from database.
    // uses self-join to associate each employee with their manager (includes manager first and last name)
    const query = `
        SELECT employee.id AS 'Employee ID',
               employee.first_name AS 'First Name',
               employee.last_name AS 'Last Name',
               role.title AS 'Job Title',
               department.name_department AS 'Department Name',
               role.salary AS 'Salary',
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

// adds a new department
function addDepartments() {
    // asks user for new department name
    inquirer.prompt({
        type: "input",
        name: "name_department",
        message: "What is the new department name?"
    }).then(
        // inserts new department name into 'department' table
        function(data) {
            db.query("INSERT INTO department(name_department) VALUES(?)", data.name_department,(err, results)=> {
                if (err) throw err;
                console.log("New department has been added");
                menu();
            });
        }
    );
}

// adds a new role
async function addRole() {
    // function that queries department (is used to )
    const deptList = await queryDepartments();
    // asks user for new job title (role), salary, and department
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
        type: "list",
        name: "department_id",
        message: "What department does this new role belong to?",
        choices: deptList.map((dep) => ({ name: dep.name_department, value: dep.id})),
        }
    ]).then(
        // inserts the new role data into 'role' table
        function(data) {
            db.query(
                "INSERT INTO role(title, salary, department_id) VALUES(?,?,?)", 
                [data.title, data.salary, data.department_id],
                (err, results) => {
                    if (err) throw err;
                    console.log("A new role has been added");
                    menu();
                }
            );
        }
    );
}

// adds a new employee
async function addEmployee() {
    // queries job titles(roles)
    const jobTitles = await queryTitles();
    // queries employees
    const allEmployees = await queryAllEmployees();
    // asks user for new employee's first name, last name, job title(role), and manager
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
        message: "What is the job title of the new employee?",
        choices: jobTitles.map((job) => ({ name: job.title, value: job.id})),
        },
        {
        type: "list",
        name: "manager_id",
        message: "Select the manager of the new employee:",
        choices: allEmployees.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
            })),
        } 
    ]).then(
        // inserts new employee into 'employee' table
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

// updates an employee's job title(role)
async function newUpdateEmployee() {
    // queries all employees
    const allEmployees = await queryAllEmployees();
    // queries job titles(roles)
    const jobTitles = await queryTitles();
    // asks user to select which employee to update and what their new role is going to be
    inquirer.prompt([
        {
            name: "employeeSelection",
            message: "Which employee would you like to update?",
            type: "list",
            choices: allEmployees.map((employee) => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
        },
        {
            name: "roleId",
            type: "list",
            message: "Select the new role",
            choices: jobTitles.map((job) => ({ name: job.title, value: job.id})), 
        }
    ]).then(
        // updates the selected employee's job title(role) in the 'employee' table
        function (data) {
        db.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: data.roleId
                },
                {
                    id: data.employeeSelection
                }
            ],
            (err, results) => {
                if (err) throw err;
                console.log("Employee's role has been updated");
                menu();
            }
        );
    });
}