import { MenuProvider } from './MenuProvider';
import * as os from 'os';
import { CppFiles } from './CppFiles';
import { AsmFiles } from './AsmFiles';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { print } from 'util';

    
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    activateAsmTools(context);
    activateCppTools(context);
}

function activateCppTools(context: vscode.ExtensionContext) {
        // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "whitworth-cpp" is now active!');

    ////////////////////////////////////////////////////////////////////////////////////////////
    // Register Commands for CPP Projects
    ////////////////////////////////////////////////////////////////////////////////////////////
    // The commands are defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let command_chooseCppProjFolder = vscode.commands.registerCommand('extension.chooseCppProjFolder', () => {
        // The code you place here will be executed every time your command is executed
        let success =  vscode.commands.executeCommand("workbench.action.files.openFolder", function () { });
        success.then( function () {
            // Display a message box to the user
            vscode.window.showInformationMessage('Project folder chosen!');
        });
    }); 
    
    context.subscriptions.push(command_chooseCppProjFolder);

     let command_createCppProj = vscode.commands.registerCommand('extension.createCppProj', function () {
        // The code you place here will be executed every time your command is executed
        var cppfiles = new CppFiles();
        cppfiles.createFiles();

        // Display a message box to the user
        vscode.window.showInformationMessage('Welcome to Whitworth CS! We\'re running your CS project on ' + os.platform() + ', ' + os.hostname() + '.' );
    });
    context.subscriptions.push(command_createCppProj);     // Register the Cpp Project Command

    let command_CppTips = vscode.commands.registerCommand('extension.CppTips', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Select Tasks | Run Task and select the type of task you wan to run.');
    });
    context.subscriptions.push(command_CppTips);

    // Activate the menu system for all the CPP commands
    // The actual menu has been defined in the MenuProvider.GetChildren funciton of 
    // the MenuProvider.ts file, each menu item must all be a command.
    // Create and register the menu provider class for custom command menus
    const cpp_tools_menu_Provider = new MenuProvider("CPP");
    vscode.window.registerTreeDataProvider('cpp-tools', cpp_tools_menu_Provider);
}


function activateAsmTools(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "whitworth-asm" is now active!');

    ////////////////////////////////////////////////////////////////////////////////////////////
    // Register Commands for ASM Projects
    ////////////////////////////////////////////////////////////////////////////////////////////
    // The commands are defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let command_chooseAsmProjFolder = vscode.commands.registerCommand('extension.chooseAsmProjFolder', () => {
        // The code you place here will be executed every time your command is executed
        let success =  vscode.commands.executeCommand("workbench.action.files.openFolder", function () { });
        success.then( function () {
            // Display a message box to the user
            vscode.window.showInformationMessage('Project folder chosen!');
        });
    }); 

    context.subscriptions.push(command_chooseAsmProjFolder);

    let command_createAsmpProj = vscode.commands.registerCommand('extension.createAsmProj', function () {
        // The code you place here will be executed every time your command is executed
        var asmfiles = new AsmFiles();
        asmfiles.createFiles();

        // Display a message box to the user
        vscode.window.showInformationMessage('Welcome to Whitworth CS! We\'re running your CS project on ' + os.platform() + ', ' + os.hostname() + '.' );
    });
    context.subscriptions.push(command_createAsmpProj);     // Register the Asm Project Command

    let command_AsmTips = vscode.commands.registerCommand('extension.AsmTips', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Select Tasks | Run Task and select the type of task you wan to run.');
    });
    context.subscriptions.push(command_AsmTips);

    // Activate the menu system for all the ASM commands
    // The actual menu has been defined in the MenuProvider.GetChildren funciton of 
    // the MenuProvider.ts file, each menu item must all be a command.
    // Create and register the menu provider class for custom command menus
    const asm_tools_menu_Provider = new MenuProvider("ASM");
    vscode.window.registerTreeDataProvider('asm-tools', asm_tools_menu_Provider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}