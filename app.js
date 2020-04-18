const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, 'team.html');
const render = require("./lib/htmlRenderer");

//function is of questions for all employees, these will be pushed to the different objects
//later in the application
async function allEmployees() {
    const responses = await inquirer.prompt([{
            type: 'input',
            message: "What is the employee's name?",
            name: 'name',
            checkforInput: function checkInput(name) {
                if (name !== '') {
                    return name
                }
            }
        },
        {
            type: 'input',
            message: "What is the employee's email?",
            name: 'email',
            checkforInput: function checkInput(name) {
                if (name !== '') {
                    return name
                }
            }
        },
        {
            type: 'input',
            message: "What is the employee's ID number?",
            name: 'idNumber',
            checkforInput: function checkInput(name) {
                if (name !== '') {
                    return name
                }
            }
        },
        {
            type: 'list',
            message: "What is the team member's role?",
            name: 'role',
            choices: ['Manager', 'Engineer', 'Inter']
        }
    ]);
    return responses;
}

//Choosing the role of the employee
async function employeeRole(e) {
    const {
        name,
        idNumber,
        email,
        role
    } = e;
    switch (role) {
        case 'Manager':
            return managerQuestion({
                name,
                idNumber,
                email,
                role
            });
        case 'Engineer':
            return engineerQuestion({
                name,
                idNumber,
                email,
                role
            });
        case 'Inter':
            return internQuestion({
                name,
                idNumber,
                email,
                role
            });
        default:
            return 'Must choose one of the three roles.'
    }
};


//if manager is selected question below will be asked.
async function managerQuestion(data) {
    const {
        name,
        idNumber,
        email
    } = data;
    const managerResponse = await inquirer.prompt([{
        type: 'input',
        message: "What is the manager's office number?",
        name: 'officeNumber',
        checkforInput: function checkInput(name) {
            if (name !== '') {
                return name
            }
        }
    }, ]);
    const {
        officeNumber
    } = managerResponse;

    // creates the new manager variable with all the information that correlates.
    const newManager = new Manager(name, idNumber, email, officeNumber)

    return newManager
};

//if engineer is selected question below will be asked.
async function engineerQuestion(data) {
    const {
        name,
        idNumber,
        email
    } = data;
    const engineerResponse = await inquirer.prompt([{
        type: 'input',
        message: "What is the employee's github username?",
        name: 'githubId',
        checkforInput: function checkInput(name) {
            if (name !== '') {
                return name
            }
        }
    }, ]);
    const {
        githubId
    } = engineerResponse;

    // creates the new engineer variable with all the information that correlates.
    const newEngineer = new Engineer(name, idNumber, email, githubId)

    return newEngineer;
};

//if intern is selected question below will be asked.
async function internQuestion(data) {
    const {
        name,
        idNumber,
        email
    } = data;
    const internResponse = await inquirer.prompt([{
        type: 'input',
        message: "Where does the intern attend school?",
        name: 'school',
        checkforInput: function checkInput(name) {
            if (name !== '') {
                return name
            }
        }
    }, ]);
    const {
        school
    } = internResponse;

    // creates the new intern variable with all the information that correlates.
    const newIntern = new Intern(name, idNumber, email, school)

    return newIntern;
};



// this starts the inquiry process by asking what type of employee is going to be logged. Based on the role that is selected will either ask
//what office number, githubID, or school they are going too.
async function startApp() {
    const {
        name,
        idNumber,
        email,
        role
    } = await allEmployees();

    return employeeRole({
        name,
        idNumber,
        email,
        role
    });
}

//  starts the function to write html. Pushes all employees into an array based on the questions from the startApp function. Will push the 
// last question of seeing if there are any other employees to look into and then move on to generating the html.
async function init() {
    try {
        let another = true;
        const employeeArray = [];
        while (another) {
            const newEmployee = await startApp();
            employeeArray.push(newEmployee);
            const affirm = await inquirer.prompt([{
                type: 'confirm',
                name: 'addEmployee',
                message: 'Are there any more employees that need to be added?'
            }]);
            if (!affirm.addEmployee) {
                another = false;
                console.log('Session end. Thank you for using this app.')
            }
        }

        const html = render(employeeArray);

        fs.writeFileSync(outputPath, html, function (err) {
            if (err) {
                throw error;
            }
        });
    } catch (err) {
        console.log(err);
    }
};

init();