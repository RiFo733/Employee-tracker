const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./config");
require("console.table");

init();

function init() {
    const logoText = logo({ name: "Employee Manager" }).render();

    console.log(logoText);

    loadMainPrompts();
}

async function loadMainPrompts() {
    const { choice } = await prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "viewAllEmployees"
                },
                {
                    name: "View All Employee's By Departments",
                    value: "viewAllEmployeeDepartments"
                },
                {
                    name: "View all Departments",
                    value: "viewAllDepartments"
                },
                {
                    name: "View All Employee's By Manager",
                    value: "viewAllMangers"
                },
                {
                    name: "View All Employee's By Roll",
                    value: "viewAllRoles"
                },
                {
                    name: "Add Employee",
                    value: "addEmployee"
                },
                {
                    name: "Remove Employee",
                    value: "removeEmployee"
                },
                {
                    name: "Update Manager",
                    value: "updateManager"
                },
                {
                    name: "Add Role",
                    value: "addRole"
                },
                {
                    name: "Update Employee Role",
                    value: "updateEmployeeRole"
                },
                {
                    name: "Remove Role",
                    value: "removeRole"
                },
                {
                    name: "Add Department",
                    value: "addDepartment"
                },
                {
                    name: "Remove Department",
                    value: "removeDepartment"
                },
                {
                    name: "Quit",
                    value: "quit"
                }
            ]
        }
    ]);

    switch (choice) {
        case "viewAllEmployees":
            return viewAllEmployees();
        case "viewAllEmployeeDepartments":
            return viewAllEmployeeDepartments();
        case "viewAllDepartments":
            return viewAllDepartments();
        case "viewAllMangers":
            return viewAllMangers();
            case "viewAllRoles":
                return viewAllRoles();
        case "addEmployee":
            return addEmployee();
        case "removeEmployee":
            return removeEmployee();
        case "updateManager":
            return updateManager();
        case "addRole":
            return addRole();
        case "updateEmployeeRole":
            return updateEmployeeRole();
        case "removeRole":
            return removeRole();
        case "addDepartment":
            return addDepartment();
        case "removeDepartment":
            return removeDepartment();
        default:
            return quit();
    }
}

async function viewAllEmployees() {
    const employees = await db.findAllEmployees();

    console.log("\n");
    console.table(employees);

    loadMainPrompts();
}

async function viewAllEmployeeDepartments() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see employees for?",
            choices: departmentChoices
        }
    ]);

    const employees = await db.findAllEmployeesByDepartment(departmentId);

    console.log("\n");
    console.table(employees);

    loadMainPrompts();
}

async function viewAllDepartments() {
    const departments = await db.findAllDepartments();

    console.log("\n");
    console.table(departments);

    loadMainPrompts();
}

async function viewAllMangers() {
    const managers = await db.findAllEmployees();

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee do you want to see direct reports for?",
            choices: managerChoices
        }
    ]);

    const employees = await db.findAllEmployeesByManager(managerId);

    console.log("\n");

    if (employees.length === 0) {
        console.log("The selected employee has no direct reports");
    } else {
        console.table(employees);
    }

    loadMainPrompts();
}

async function viewAllRoles() {
    const roles = await db.findAllRoles();

    console.log("\n");
    console.table(roles);

    loadMainPrompts();
}

async function addEmployee() {
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();

    const employee = await prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);

    const roleChoices = roles.map(({ id, title}) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "What is this employee's role?",
            choices: roleChoices
        }
    ]);

    employee.role_id = roleId;

    await db.createEmployee(employee);

    console.log("Employee added");
    
    loadMainPrompts();

}

async function removeEmployee() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: employeeChoices
        }
    ]);

    await db.removeEmployee(employeeId);

    console.log("Employee removed");

    loadMainPrompts();
}

async function updateManager(){
    const emplopyees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    })); 
    
    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which manager do you want to update?",
            choices: employeeChoices
        }
    ]);

    const managers = await db.findAllEmployeesByManager(employeeId);

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    })); 
    const { managerId } = await prompt([
        {
        type: "list",
        name: "managerId",
        message: "Which employee is to be promoted?",
        choices: managerChoices
    }
    ]);
    await db.updateEmployeeManager(employeeId, managerId);

    console.log("Manager updated");
    
    loadMainPrompts();
}

async function addRole(){
    const departments  = await db.findAllDepartments();

    const departmentsChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const role = await prompt([
        {
            name: "title",
            message: "What is their role?"
        },
        {
            name: "salary",
            message: "What is the salary of this role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which deparment does this role belong to?",
            choices: departmentsChoices
        },
    ]);
    await db.createRole(role);

    console.log("${role.title} added");
    
    loadMainPrompts();
}

async function updateEmployeeRole() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        }
    ]);

    const role = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
}));

const { roleId } = await prompt([
    {
    type: "list",
    name: "roleId",
    message: "What is this employee's new role?",
    choices: roleChoices
}
]);

await db.updateEmployeeRole(employeeId, roleId);

console.log("Role updated");

loadMainPrompts();
}

async function removeRole(){
    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to remove?",
            choices: roleChoices
        }
    ]);

    await db.removeRole(roleId);

    console.log("Removed role from the database");

    loadMainPrompts();
}

async function addDepartment(){
    const department = await prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);
    await db.createDepartment(department);

    console.log("${department.name} added");
    
    loadMainPrompts();
}


async function removeDepartment(){
    const departments = await db.findAllDepartments();

    const departmentChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department do you want to remove?",
            choices: departmentChoices
        }
    ]);

    await db.removeDepartment(departmentId);

    console.log("Removed department from the database");

    loadMainPrompts();
}

function quit() {
    console.log("Goodbye!");
    process.exit();
}