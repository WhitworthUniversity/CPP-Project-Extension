// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as fs from 'fs';
import * as os from 'os';

export class AsmFiles {

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
        }
        else {
            //Assume Windows
            this._compilerPath = "\${workspaceFolder}/.vscode/";
            this._compilerExe = "\${workspaceFolder}/.vscode/assemble.ps1";
            this._exename = "main.exe";
            this._dbgPath = "\${workspaceFolder}/.vscode/";
        }
    }

    createFiles64() {
        this._checkVscodeFolder();
        this._createFolders();
        this._createTasksFile();
        this._createBuildScript64();
        this._createDebugScript64();
    }

    _checkVscodeFolder() {
        var vscodefolder = this._cwd + '/.vscode';
        if (!fs.existsSync(vscodefolder))
            fs.mkdirSync(vscodefolder);
    }



    _createTasksFile() {

        var tasks = '' +
        '{\n' +
            '\t// See https://go.microsoft.com/fwlink/?LinkId=733558\n' +
            '\t// for the documentation about the tasks.json format\n' +
            '\t"version": "2.0.0",\n' +
            '\t"tasks": [\n' +
                '\t\t{\n' +
                    '\t\t\t"label": "Assemble Assembly Code",\n' +
                    '\t\t\t"type": "shell",\n' +
                    '\t\t\t"command": "\${workspaceFolder}/.vscode/assemble.ps1",\n' +
                    '\t\t\t"args": [ "-workspaceFolder", "\${workspaceFolder}" ],\n' +
                    '\t\t\t"group": {\n' +
                        '\t\t\t\t"kind": "build",\n' +
                        '\t\t\t\t"isDefault": true\n' +
                    '\t\t\t\t}\n'+
                '\t\t},\n'+               
                '\t\t{\n' +
                    '\t\t\t"label": "Debug Assembly Code with Visual Studio Debugger",\n' +
                    '\t\t\t"type": "shell",\n' +
                    '\t\t\t"command": "\${workspaceFolder}/.vscode/debug.ps1",\n' +
                    '\t\t\t"args": [ "-workspaceFolder", "\${workspaceFolder}" ]\n' +
                '\t\t}\n' +
            '\t]\n' +
        '}\n';

        fs.writeFile(this._cwd + '/.vscode/tasks.json', tasks, (err) => {
            if (err) throw err;
            console.log('The tasks file has been saved');
        });
    }

    _createBuildScript64() {
        var buildScript = '' +
            '<# Build Script to Build 64 Bit Assembler Files using Microsofts Assembler\n' +
            'Reference for visual studio code tasks used in development: https://code.visualstudio.com/docs/editor/tasks\n' +
            'Reference for assembler command line options: ml64.exe /?  will list the command line options\n' +
            '#>\n' +
            'param (\n' +
                '\t[string]\$workspaceFolder = "."\n' +
            ')\n' +
            'cd "\$workspaceFolder\/bin\/"\n' +
            '\$assemblerfiles="" + (get-item \$workspaceFolder\/source\/*.asm)\n' +
            'if ( -not \$assemblerfiles) {\n' +
                '\techo "No files to compile!"\n' +
                '\texit\n' +
            '}\n'+
            '\$exefile="\$workspaceFolder\/bin\/main.exe"\n' +
            '# Set the 64 bit development environment by calling vcvars64.bat \n' +
            '# Compile and link in one step using ml64.exe \n' +
            '\$ranstring = -join ((48..57) + (97..122) | Get-Random -Count 32 | % {[char]$_})\n' +
            '\$batfile = "\$workspaceFolder\/.vscode\/" + \$ranstring + ".bat"\n' +
            '\$command = \'"C:\/Program Files (x86)\/Microsoft Visual Studio 14.0\/VC\/bin\/amd64\/vcvars64.bat"\'\n' +
            'echo \$command > \$batfile\n' +
            '\$command = \'"C:\/Program Files (x86)\/Microsoft Visual Studio 14.0\/VC\/bin\/amd64\/ml64.exe"\' + " /nologo /Zi /Zd /Fe " + \$exefile + " /W3 /errorReport:prompt /Ta " + \$assemblerfiles + \' /link /ENTRY:"main" /LARGEADDRESSAWARE:NO C:/Irvine/Irvine64.obj kernel32.lib \'\n' +
            'echo \$command >> \$batfile\n' +
            "type \$batfile | CMD\n" +
            '\$' + 'ofiles' + " =\ " + "\(" + "get-item " + "*.obj" + "\)" + "\n" +
            "if " + "\(" + "\$" + "ofiles" + "\)" + "{\n" +
            "\t\trm\ " + "\$" + "ofiles" + "\n" +
            "\}" + "\n" +
            "rm " + "\$" + "batfile" + "\n";

        fs.writeFile(this._cwd + '/.vscode/assemble.ps1', buildScript, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('The build script has been saved');
            }
        });
    }

    _createDebugScript64() {
        var debugScript = ''+
            '<# Debug Script\n' + 
            'Reference used in development: https://social.msdn.microsoft.com/Forums/vstudio/en-US/3d854f8d-3597-423c-853a-ba030e721d6e/visual-studio-debugger-command-line?forum=vcgeneral\n' +
            '#>\n' +
            'param (\n' +
                '\t[string]\$workspaceFolder = "."\n' +
            ')\n' +
            'echo off\n' +
            'set exefile=%1%\n' +
            'echo "Starting visual studio debugger for %exefile%"\n' +
            'echo "------------------------------------------------------------------------------------------------"\n' +
            'echo on\n' +
            '\$assemblerfiles="" + (get-item \$workspaceFolder\/source\/*.asm)\n' +
            '\$exefile="\$workspaceFolder\/bin\/main.exe"\n' +
            '# Set the 64 bit development environment by calling vcvars64.bat \n' +
            '# Compile and link in one step using ml64.exe\n' +
            '\$ranstring = -join ((48..57) + (97..122) | Get-Random -Count 32 | % {[char]\$_})\n' +
            '\$batfile = "\$workspaceFolder\/.vscode\/" + \$ranstring + ".bat"\n' +
            '\$command = \'"C:\/Program Files (x86)\/Microsoft Visual Studio 14.0\/VC\/bin\/amd64\/vcvars64.bat"\'\n' +
            'echo \$command > \$batfile\n' +
            '\$command = \'"C:\/Program Files (x86)\/Microsoft Visual Studio\/2017\/Community\/Common7\/IDE\/devenv.exe" \' + \$assemblerfiles + \' /debugexe \' + \$exefile \n' +
            'echo \$command >> \$batfile\n' +
            'type \$batfile | CMD\n' +
            'rm \$batfile\n';

        fs.writeFile(this._cwd + '/.vscode/debug.ps1', debugScript, (err) => {
            if (err) throw err;
            console.log('The debug script has been saved');
        });
    }

    _createLaunchFile64() {
        // TODO - see if we can configure launch tasks for assembler...
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
