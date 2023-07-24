/* (copied and pasted miniproject)
- should i put the connecting part of my code in a config file? 
- should i add a .env file to conceal my mysql password? */


// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require("inquirer");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
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
    db.query("SELECT * FROM department", (err, res)=> {
        console.table(res);
        menu();
    })
}

function viewAllRoles() {
    db.query("SELECT * FROM role", (err, res)=> {
        console.table(res);
        menu();
    })
}

function viewAllEmployees() {
    db.query("SELECT * FROM employee", (err, res)=> {
        console.table(res);
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
            db.query("INSERT INTO department(name_department) VALUES(?)", data.name_department,(err, res)=> {
                console.table(res);
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
                "INSERT INTO employee(first_name, last_name, role_id, manger_id) VALUES(?,?,?,?)", 
                [data.first_name, data.last_name, data.role_id, data.manager_id],
                (err, results) => {
                    console.log("A new employee has been added");
                    menu();
                } 
            )
        } 
    )
}
/*
// Create a movie
app.post('/api/new-movie', ({ body }, res) => {
  const sql = `INSERT INTO movies (movie_name)
    VALUES (?)`;
  const params = [body.movie_name];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Read all movies
app.get('/api/movies', (req, res) => {
  const sql = `SELECT fid, movie_name AS title FROM movies`;

  console.log(sql);
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.log(rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Delete a movie
app.delete('/api/movie/:id', (req, res) => {
  const sql = `DELETE FROM movies WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Read list of all reviews and associated movie name using LEFT JOIN
app.get('/api/movie-reviews', (req, res) => {
  const sql = `SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// BONUS: Update review name
app.put('/api/review/:id', (req, res) => {
  const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
  const params = [req.body.review, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

*/