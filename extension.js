// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
//os.platform() to get the OS (win32)
const os = require('os');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "whitworth-cpp" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.createCppProj', function () {
        // The code you place here will be executed every time your command is executed
        var cppfiles = new CppFiles();
        cppfiles.createFiles();

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World! We\'re running on ' + os.platform() + ', ' + os.hostname() );
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

class CppFiles {
    constructor() {
        this._platform = os.platform();
        this._cwd = vscode.workspace.rootPath;

        if (this._platform === "darwin") {
            //Max OSX
            this._compilerPath = "g++";
            this._exename = "main";
            this._dbgPath = "gdb";
        }
        else {
            //Assume Windows
            this._compilerPath = "C:/MinGW/bin/g++.exe";
            this._exename = "main.exe";
            this._dbgPath = "C:/MinGW/bin/gdb.exe";
        }
    }

    createFiles() {
        this._checkVscodeFolder();
        this._createPropertiesFile();
        this._createTasksFile();
        this._createLaunchFile();

        this._createFolders();
    }

    _checkVscodeFolder() {
        var vscodefolder = this._cwd + '/.vscode';
        if (!fs.existsSync(vscodefolder))
            fs.mkdirSync(vscodefolder);
    }

    _createPropertiesFile() {
        var props = '{\n' +
            '\t"configurations": [\n' +
                '\t\t{\n' +
                    '\t\t\t"name": "Whitworth CS",\n' +
                    '\t\t\t"includePath": [\n' +
                        '\t\t\t\t"${workspaceFolder}/**"\n' +
                    '\t\t\t],\n' +
                    '\t\t\t"defines": [\n' +
                        '\t\t\t\t"_DEBUG"\n'+
                    '\t\t\t],\n'+
                    '\t\t\t"compilerPath": "' + this._compilerPath + '",\n'+
                    '\t\t\t"cStandard": "c11",\n'+
                    '\t\t\t"cppStandard": "c++17",\n'+
                    '\t\t\t"intelliSenseMode": "clang-x64"\n'+
                '\t\t}\n' +
            '\t],\n'+
            '\t"version": 4\n'+
        '}';

        fs.writeFile(this._cwd + '/.vscode/c_cpp_properties.json', props, (err) => {
            if (err) throw err;
            console.log('The cpp properties file has been saved');
        });
    }

    _createTasksFile() {
        var tasks = '{\n' +
            '\t// See https://go.microsoft.com/fwlink/?LinkId=733558\n' +
            '\t// for the documentation about the tasks.json format\n' +
            '\t"version": "2.0.0",\n' +
            '\t"tasks": [\n' +
                '\t\t{\n' +
                    '\t\t\t"label": "build project",\n' +
                    '\t\t\t"type": "shell",\n' +
                    '\t\t\t"command": "' + this._compilerPath + '",\n' +
                    '\t\t\t"args": [\n' +
                        '\t\t\t\t"-o", "${workspaceFolder}/bin/' + this._exename + '",\n' +
                        '\t\t\t\t"-I", "${workspaceFolder}/headers",\n' +
                        '\t\t\t\t"-ggdb", "${workspaceFolder}/source/*.cpp"\n' +
                    '\t\t\t],\n' +
                    '\t\t\t"group": {\n' +
                        '\t\t\t\t"kind":"build",\n' +
                        '\t\t\t\t"isDefault":true\n' +
                    '\t\t\t},\n' +
                    '\t\t\t"problemMatcher": []\n' +
                '\t\t}\n' +
                '\t\t,\n' +
                '\t\t{\n' +
                    '\t\t\t"label": "run",\n' +
                    '\t\t\t"type":"shell",\n' +
                    '\t\t\t"command":"./main",\n' +
                    '\t\t\t"problemMatcher":[],\n' +
                '\t\t}\n' +
            '\t]\n' +
        '}';

        fs.writeFile(this._cwd + '/.vscode/tasks.json', tasks, (err) => {
            if (err) throw err;
            console.log('The tasks file has been saved');
        });
    }

    _createLaunchFile() {
        var launch = '{\n' +
            '\t// Use IntelliSense to learn about possible attributes.\n' +
            '\t// Hover to view descriptions of existing attributes.\n' +
            '\t// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387\n' +
            '\t"version": "0.2.0",\n' +
            '\t"configurations": [\n' +
                '\t\t{\n' +
                    '\t\t\t"name": "(gdb) Launch",\n' +
                    '\t\t\t"type": "cppdbg",\n' +
                    '\t\t\t"request": "launch",\n' +
                    '\t\t\t"program": "${workspaceFolder}/bin/' + this._exename + '",\n' +
                    '\t\t\t"args": [],\n' +
                    '\t\t\t"stopAtEntry": false,\n' +
                    '\t\t\t"cwd": "${workspaceFolder}",\n' +
                    '\t\t\t"environment": [],\n' +
                    '\t\t\t"externalConsole": true,\n' +
                    '\t\t\t"MIMode": "gdb",\n' +
                    '\t\t\t"miDebuggerPath": "' + this._dbgPath + '",\n' +
                    '\t\t\t"setupCommands": [\n' +
                        '\t\t\t\t{\n' +
                            '\t\t\t\t\t"description": "Enable pretty-printing for gdb",\n' +
                            '\t\t\t\t\t"text": "-enable-pretty-printing",\n' +
                            '\t\t\t\t\t"ignoreFailures": true\n' +
                        '\t\t\t\t}\n' +
                    '\t\t\t]\n' +
                '\t\t}\n' +
            '\t]\n' +
        '\t}';

        fs.writeFile(this._cwd + '/.vscode/launch.json', launch, (err) => {
            if (err) throw err;
            console.log('The launch file has been saved');
        });
    }

    _createFolders() {
        fs.mkdir(this._cwd + '/headers', (err) => {
            if (err) throw err;
            console.log('headers folder created');
        });
        fs.mkdir(this._cwd + '/source', (err) => {
            if (err) throw err;
            console.log('source folder created');
        });
        fs.mkdir(this._cwd + '/bin', (err) => {
            if (err) throw err;
            console.log('bin folder created');
        });
    }
}
