const inquirer = require('inquirer');
const cTable = require('console.table');

const questionsArray = [];

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
    if (answers.prompt === 'View all departments.') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.table(result);
        questions();
      });
    } else if (answers.prompt === 'View all roles.') {
      db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err;
        console.table(result);
        questions();
      });
    } else if (answers.prompt === "View all employee's.") {
      db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;
        console.table(result);
        questions();
      });
    } else if (answers.prompt === 'Add a department.') {
      inquirer.prompt([
        {
          name: 'newDepartment',
          type: 'input',
          message: 'What is the name of your new department?',
          validate: departmentInput => {
            if (departmentInput) {
              return true;
            } else {
              console.log('Please give your new department a name!');
              return questions();
            }
          }
      }]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.department} to the database.`);
          questions();
        });
      })
    } else if (answers.prompt === 'Add a role.') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        
        inquirer.prompt([
          {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of your new role?', 
            validate: roleInput => {
              if (roleInput) {
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
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].name);
              } return array;  
            }
          }
        ]).then((answers) => {
            for (var i = 0; i < result.length; i++) {
            if (result[i].name === answers.department) {
              var department = result[i];
            }
          }
          db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.newRole, answers.salary, department.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.role} to the database.`)
            questions();
          });
        })
      });
    } else if (answers.prompt === 'Add an employee.') {
      db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;

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
            type: 'input',
            message: "What is the employee's role?", 
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          },
          {
            name: 'employeeManager',
            type: 'input',
            message: "Who is the employee's manager?",
            validate: managerInput => {
              if (managerInput) {
                return true;
              } else {
                console.log('Please assign this employee a manager!');
                return false;
              }
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.role) {
              var role = result[i];
            }
          }
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.newFirst, answers.newLast, answers.role.id, answers.manager.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.newFirst} ${answers.newLast} to the database.`)
            questions();
          });
        })
      });    
    } else if (answers.prompt === 'Update an employee role.') {
      db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            name: 'chooseEmployee',
            type: 'list',
            message: "Which employee's role do you want to update?",
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].last_name);
              }
              var employeeArray = [...new Set(array)];
              return employeeArray;
            }
          },
          {
            name: 'assignNewRole',
            type: 'list',
            message: "Which role do you want to assign the selected employee?",
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          } 
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].last_name === answers.employee) {
              var name = result[i];
            }
          }
          
          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.role) {
              var role = result[i];
            }
          }

          db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
            if (err) throw err;
            console.log(`Updated ${answers.employee} role to the database.`)
            questions();
          });
        })
      });
    } else if (answers.prompt === "Nothing, I'm all done.") {
      db.end();
      console.log('Le Fin!');
    }
  })
};

// const init = () => {
//   questions();
// }

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



// As the image illustrates, your schema should 
// contain the following three tables:

// department

// id: INT PRIMARY KEY

// name: VARCHAR(30) to hold department name

// role

// id: INT PRIMARY KEY

// title: VARCHAR(30) to hold role title

// salary: DECIMAL to hold role salary

// department_id: INT to hold reference to 
// department role belongs to

// employee

// id: INT PRIMARY KEY

// first_name: VARCHAR(30) to hold employee first name

// last_name: VARCHAR(30) to hold employee last name

// role_id: INT to hold reference to employee role

// manager_id: INT to hold reference to another 
// employee that is the manager of the current employee 
// (null if the employee has no manager)