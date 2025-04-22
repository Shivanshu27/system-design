// The Proxy design pattern is a structural design pattern that provides an object representing another object. It acts as an intermediary, controlling access to the original object, allowing you to add additional functionality such as access control, lazy initialization, logging, etc.

// Here's an example of how you can implement the Proxy design pattern with CRUD operations on an employee table, where the proxy layer checks permissions (user or admin) to allow those operations:


// Interface for Employee operations
class EmployeeService {
    create(employee) {
        throw new Error("This method must be overridden!");
    }

    read(employeeId) {
        throw new Error("This method must be overridden!");
    }

    update(employee) {
        throw new Error("This method must be overridden!");
    }

    delete(employeeId) {
        throw new Error("This method must be overridden!");
    }
}

// Real implementation of EmployeeService
class EmployeeServiceImpl extends EmployeeService {
    create(employee) {
        console.log(`Employee ${employee.name} created.`);
    }

    read(employeeId) {
        console.log(`Reading employee with ID: ${employeeId}`);
    }

    update(employee) {
        console.log(`Employee ${employee.name} updated.`);
    }

    delete(employeeId) {
        console.log(`Employee with ID: ${employeeId} deleted.`);
    }
}

// Proxy class to control access based on user roles
class EmployeeServiceProxy extends EmployeeService {
    constructor(userRole) {
        super();
        this.userRole = userRole;
        this.employeeService = new EmployeeServiceImpl();
    }

    create(employee) {
        if (this.userRole === 'admin') {
            this.employeeService.create(employee);
        } else {
            console.log("Permission denied: Only admins can create employees.");
        }
    }

    read(employeeId) {
        if (this.userRole === 'admin' || this.userRole === 'user') {
            this.employeeService.read(employeeId);
        } else {
            console.log("Permission denied: Invalid role.");
        }
    }

    update(employee) {
        if (this.userRole === 'admin') {
            this.employeeService.update(employee);
        } else {
            console.log("Permission denied: Only admins can update employees.");
        }
    }

    delete(employeeId) {
        if (this.userRole === 'admin') {
            this.employeeService.delete(employeeId);
        } else {
            console.log("Permission denied: Only admins can delete employees.");
        }
    }
}

// Usage
const adminProxy = new EmployeeServiceProxy('admin');
adminProxy.create({ name: 'John Doe' });
adminProxy.read(1);
adminProxy.update({ name: 'John Doe' });
adminProxy.delete(1);

const userProxy = new EmployeeServiceProxy('user');
userProxy.create({ name: 'Jane Doe' }); // Permission denied
userProxy.read(2);
userProxy.update({ name: 'Jane Doe' }); // Permission denied
userProxy.delete(2); // Permission denied



// In this example:

// EmployeeService is an interface that defines the CRUD operations.
// EmployeeServiceImpl is the real implementation of EmployeeService that performs the actual operations.
// EmployeeServiceProxy is the proxy class that controls access to EmployeeServiceImpl based on the user's role (admin or user).
// The proxy checks the user's role before allowing the operation. Admins can perform all operations, while users can only read.
// The usage section demonstrates how the proxy controls access based on the user's role.