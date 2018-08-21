import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/* These two classes creates the base classes for implementing a menu system using 
TreeDataProvider class from VSCODE. */
export class MenuProvider implements vscode.TreeDataProvider<Dependency> {

	private _toolChain = "";
	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

	constructor( ToolChain: string ) {
		this._toolChain = ToolChain; 
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {

		return new Promise(resolve => {
			if ( this._toolChain == "CPP" ) {
				resolve( [
					new Dependency( "Choose a C++ Project Folder...", "command_chooseCppProjFolder", 
									vscode.TreeItemCollapsibleState.None,
									{ command: 'extension.chooseCppProjFolder', 
									title: 'Choose a C++ Project Folder', 
									arguments: [] 
								} ),
					new Dependency( "Make C++ Project Files in the Current Folder...", 
									"command_createCppProj", vscode.TreeItemCollapsibleState.None, 
									{ command: 'extension.createCppProj', 
									title: '"Make C++ Project Files in the Current Folder...', 
									arguments: [] 
								} ),
					new Dependency( "Run or Debug the Current C++ Project...", "command_CppTips", 
									vscode.TreeItemCollapsibleState.None, 
									{ command: 'extension.CppTips', 
									title: 'Run or Debug a C++ Project',
									arguments: [] 
								} )
					
				] );
			} else if ( this._toolChain == "ASM") {
				resolve( [
					new Dependency( "Choose an Assembler Project Folder...", "command_chooseAsmProjFolder", 
									vscode.TreeItemCollapsibleState.None,
									{ command: 'extension.chooseAsmProjFolder', 
									title: 'Choose an Assembler Project Folder...', 
									arguments: [] 
								} ),
					new Dependency( "Make a 64 Bit Assembler Project in the Current Folder...", 
									"command_createAsmProj64", vscode.TreeItemCollapsibleState.None, 
									{ command: 'extension.createAsmProj64', 
									title: '"Make a 64 Bit Assembler Project Files in the Current Folder', 
									arguments: [] 
								} ),
					new Dependency( "Run or Debug a Assembler Project", "command_CppTips", 
									vscode.TreeItemCollapsibleState.None, 
									{ command: 'extension.AsmTips', 
									title: 'Run or Debug an Assembler Project',
									arguments: [] 
								} )	
				] );
			} else if ( this._toolChain == "HighPerf") {

			} else if ( this._toolChain == "WebDev") {
				
			}
		});
	}
}

class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.version}`
	}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}
