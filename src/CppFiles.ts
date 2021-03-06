// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as fs from 'fs';
import * as os from 'os';

export class CppFiles {

    private _platform;
    private _cwd;
    private _compilerPath;
    private _compilerExe;
    private _exename;
    private _dbgPath;

    constructor() {
        this._platform = os.platform();
        this._cwd = vscode.workspace.rootPath;

        if (this._platform === "darwin") {
            //Mac OSX
            this._compilerPath = "";
            this._compilerExe = "g++";
            this._exename = "main";
            this._dbgPath = "gdb";
        }
        else {
            //Assume Windows
            this._compilerPath = "C:/MinGW/bin/";
            this._compilerExe = "g++.exe";
            this._exename = "main.exe";
            this._dbgPath = "C:/MinGW/bin/gdb.exe";
        }
    }

    createFiles() {
        this._checkVscodeFolder();
        this._createFolders(); 
        this._createPropertiesFile();
        this._createTasksFile();
        this._createLaunchFile();
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
                    '\t\t\t"compilerPath": "' + this._compilerPath + this._compilerExe + '",\n'+
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
                    '\t\t\t"command": "' + this._compilerPath + this._compilerExe + '",\n' +
                    '\t\t\t"args": [\n' +
                        '\t\t\t\t"-o", "${workspaceFolder}/bin/' + this._exename + '",\n' +
                        '\t\t\t\t"-I", "${workspaceFolder}/headers",\n' +
                        '\t\t\t\t"-ggdb", "${workspaceFolder}/source/*.cpp"\n' +
                    '\t\t\t],\n' +
                    '\t\t\t"group": {\n' +
                        '\t\t\t\t"kind":"build",\n' +
                        '\t\t\t\t"isDefault":true\n' +
                    '\t\t\t},\n' +
                    '\t\t\t"problemMatcher": [],\n' +
                    '\t\t\t"options": {\n' +
                    '\t\t\t\t"cwd": "' + this._compilerPath + '"\n' +
                    '\t\t\t}\n' +
                '\t\t}\n' +
                '\t\t,\n' +
                '\t\t{\n' +
                    '\t\t\t"label": "run",\n' +
                    '\t\t\t"type":"shell",\n' +
                    '\t\t\t"command":"./bin/' + this._exename + '",\n' +
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
