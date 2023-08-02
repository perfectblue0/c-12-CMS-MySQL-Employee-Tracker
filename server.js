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

            } else {

            }
        }
    )
}

menu();

function viewAllDepartments() {
    db.query("SELECT * FROM department", (err, results)=> {
        console.table(results);
        menu();
    })
}

function viewAllRoles() {
    db.query("SELECT * FROM role", (err, results)=> {
        console.table(results);
        menu();
    })
}

function viewAllEmployees() {
    db.query("SELECT * FROM employee", (err, results)=> {
        console.table(results);
        menu();
    })
}

function addDepartments() {
    inquirer.prompt({
        type: "input",
        name: "name_department",
        message: "What is the new department name?"
    }).then(
        function(data) {
            db.query("INSERT INTO department(name_department) VALUES(?)", data.name_department,(err, results)=> {
                console.table(results);
                menu();
            })
        }
    )
    
}

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
                    console.log("A new role has been added");
                    menu();
                } 
            )
        } 
    )
}

function addEmployee() {
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
        type: "input",
        name: "role_id",
        message: "What is the role id of the new employee?"
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
                    console.log("A new employee has been added");
                    menu();
                } 
            )
        } 
    )
}
