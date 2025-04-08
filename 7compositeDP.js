class FileSystemComponent {
    constructor(name) {
        this.name = name;
    }

    // Common interface for files and directories
    getName() {
        return this.name;
    }

    // To be implemented by subclasses
    getSize() {
        throw new Error('Method must be implemented by subclass');
    }

    // Optional methods with default implementations
    add(component) {
        throw new Error('Cannot add to a file');
    }

    remove(component) {
        throw new Error('Cannot remove from a file');
    }

    getChildren() {
        throw new Error('Not a directory');
    }

    // Optional method for printing structure
    print(indent = '') {
        console.log(`${indent}${this.getName()}`);
    }
}

class File extends FileSystemComponent {
    constructor(name, size) {
        super(name);
        this._size = size;
    }

    getSize() {
        return this._size;
    }

    print(indent = '') {
        console.log(`${indent}📄 ${this.getName()} (${this.getSize()} bytes)`);
    }
}

class Directory extends FileSystemComponent {
    constructor(name) {
        super(name);
        this._children = [];
    }

    add(component) {
        this._children.push(component);
        return this;
    }

    remove(component) {
        this._children = this._children.filter(child => child !== component);
        return this;
    }

    getChildren() {
        return this._children;
    }

    getSize() {
        return this._children.reduce((total, child) => total + child.getSize(), 0);
    }

    print(indent = '') {
        console.log(`${indent}📁 ${this.getName()} (${this.getChildren().length} items)`);
        
        this._children.forEach(child => {
            child.print(indent + '  ');
        });
    }

    // Additional helper methods
    findByName(name) {
        return this._children.find(child => child.getName() === name);
    }
}

// Example usage
function createFileSystemExample() {
    // Create root directory
    const rootDir = new Directory('Root');

    // Create subdirectories
    const documentsDir = new Directory('Documents');
    const picturesDir = new Directory('Pictures');

    // Add files to documents
    documentsDir
        .add(new File('resume.pdf', 250))
        .add(new File('report.docx', 500));

    // Add files to pictures
    const vacationDir = new Directory('Vacation');
    vacationDir
        .add(new File('beach.jpg', 1024))
        .add(new File('sunset.png', 2048));

    picturesDir.add(vacationDir);

    // Add subdirectories to root
    rootDir
        .add(documentsDir)
        .add(picturesDir)
        .add(new File('notes.txt', 100));

    return rootDir;
}

// Demonstrate the file system
const fileSystem = createFileSystemExample();
fileSystem.print();
console.log('\nTotal file system size:', fileSystem.getSize(), 'bytes');




// Let me break down the key aspects of this Composite Design Pattern implementation for a file system:

// Core Components:

// FileSystemComponent: An abstract base class defining the common interface for both files and directories
// File: Represents individual files with a fixed size
// Directory: Represents a collection of files and subdirectories


// Key Design Pattern Characteristics:

// Unified Interface: Both File and Directory inherit from FileSystemComponent
// Recursive Structure: Directories can contain both files and other directories
// Polymorphic Behavior: Methods like getSize() and print() work consistently across files and directories


// Key Methods:

// add(): Allows adding components to a directory
// remove(): Removes a component from a directory
// getSize(): Calculates total size recursively for directories
// print(): Displays the entire file system structure with indentation


// Demonstration Features:

// Creating nested file system structures
// Calculating total size of directories
// Printing hierarchical structure with visual indicators



// Example Execution Flow:

// Creates a root directory
// Adds subdirectories (Documents, Pictures)
// Adds files to directories
// Creates nested structures (Vacation subdirectory in Pictures)
// Prints the entire file system structure
// Calculates total file system size

// When you run this code, it will output a tree-like representation of the file system, showing the hierarchical structure and providing size information.
// Advantages of this Approach:

// Flexible and extensible file system representation
// Supports arbitrary nesting of files and directories
// Consistent interface for operations
// Easy to add new types of file system components