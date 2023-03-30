const inquirer = require('inquirer');
const db = require('./connection');
const cTable = require('console.table');

function viewDepartment() {
  const department = [];
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) throw err;
    results.forEach((result) => {
      department.push({
        name: result.department_name,
        value: result.id,
      });
    });
  });
  return department;
};

function viewRole() {
  const role = [];
  db.query(`SELECT * FROM roles`, (err, results) => {
    if (err) throw err;
    results.forEach((result) => {
      role.push({ 
        name: result.title, 
        value: result.id, 
      });
    });
  });
  return role;
};

// Can't get a list of employee's to display under the prompted question. 
// Was able to get it to work with viewing departments and roles, 
// so I am confusion.... 
function viewEmployee() {
  const employee = [];
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) throw err;
    results.forEach((result) => {
      employee.push({
        name: result.first_name,
        value: result.id,
      });
    });
  });
  return employee;
};

const questions = function () { 
  inquirer.prompt([
    {
      name: 'initialOptions',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments.',
        'View all roles.', 
        "View all employee's.",
        'Add a department.',
        'Add a role.',
        'Add an employee.',
        'Update an employee role.',
        "Nothing, I'm all done."
        ],
    }
  ]).then((answers) => {
    if (answers.initialOptions === 'View all departments.') {
      db.query(`SELECT * FROM department`, function (err, result) {
        if (err) throw err;
        console.table(result);
        return questions();
      });
    } else if (answers.initialOptions === 'View all roles.') {
      db.query(`SELECT * FROM roles`, function (err, result) {
        if (err) throw err;
        console.table(result);
        return questions();
      });
    } else if (answers.initialOptions === "View all employee's.") {
      db.query(`SELECT * FROM employee`, function (err, result) {
        if (err) throw err;
        console.table(result);
        return questions();
      });
    } else if (answers.initialOptions === 'Add a department.') {
      inquirer.prompt([
        {
          name: 'newDepartment',
          type: 'input',
          message: 'What is the name of your new department?',
          validate: newDepartmentInput => {
            if (newDepartmentInput) {
              return true;
            } else {
              console.log('Please give your new department a name!');
              questions();
            }
          }
        }
      ]).then((answers) => {
        db.query(`INSERT INTO department (department_name) VALUES (?);`, [answers.newDepartment], (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.newDepartment} to the database.`);
          questions();
        });
      })
    } else if (answers.initialOptions === 'Add a role.') {
        inquirer.prompt([
          {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of your new role?', 
            validate: newRoleInput => {
              if (newRoleInput) {
                return true;
              } else {
                console.log('Please give your new role a name!')
                return false;
              }
            }
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What salary does this role earn?',
            validate: salaryInput => {
              if (salaryInput) {
                return true;
              } else {
                console.log('Please assign this role a salary amount!')
                return false;
              }
            }
          },
          {
            name: 'placement',
            type: 'list',
            message: 'What department would you like to add this role to?',
            choices: viewDepartment(),
          }
        ]).then((answers) => {
          db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`, [answers.newRole, answers.salary, answers.placement], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.newRole} to the database.`);
            return questions();
          });
        })
    } else if (answers.initialOptions === 'Add an employee.') {
        inquirer.prompt([
          {
            name: 'newFirst',
            type: 'input',
            message: "What is the employee's first name?",
            validate: newFirstInput => {
              if (newFirstInput) {
                return true;
              } else {
                console.log('Please add a first name!');
                return false;
              }
            }
          },
          {
            name: 'newLast',
            type: 'input',
            message: "What is the employee's last name?",
            validate: newLastInput => {
              if (newLastInput) {
                return true;
              } else {
                console.log('Please add a last name!');
                return false;
              }
            }
          },
          {
            name: 'newEmployeeRole',
            type: 'list',
            message: "What is the employee's role?", 
            choices: viewRole(),
          },
        ]).then((answers) => {
          db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`, [answers.newFirst, answers.newLast, answers.newEmployeeRole], (err, result) => {
            console.log(`Added ${answers.newFirst} ${answers.newLast} to the database.`);
            questions();
          });
        });    
    } else if (answers.initialOptions === 'Update an employee role.') {
      db.query(`SELECT * FROM employee`, (err, result) => {
        let employees = result;
        const employeeArray = employees.map((employee) => {
          return {
            name: employee.first_name,
            value: employee.id,
          }
          });
        if (err) throw err;
        inquirer.prompt([
          {
            name: 'chooseEmployee',
            type: 'list',
            message: "Which employee's role do you want to update?",
            choices: employeeArray,
          },
          {
            name: 'assignNewRole',
            type: 'list',
            message: "Which role do you want to assign the selected employee?",
            choices: viewRole(),
          } 
        ]).then((answers) => {
          db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [answers.chooseEmployee, answers.assignNewRole], (err, result) => {
            console.log(`Updated ${answers.chooseEmployee} role to the database.`)
            questions();
          });
        });
      });
    } else if (answers.initialOptions === "Nothing, I'm all done.") {
      db.end();
      console.log('Le Fin!');
    }
  })
};

// function init() {
//   inquirer.prompt(questions).then((inquirerResponses) => {
//     push.questionsArray('questions_db', inquirerResponses) => {
//       console.table(result);
//       questions();
//     }
//   });
// };

// init();

questions();








// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, {
//     name: 'bar',
//     age: 20
//   }
// ]);

// // prints
// name  age
// ----  ---
// foo   10
// bar   20
