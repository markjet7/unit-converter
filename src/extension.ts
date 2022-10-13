// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const Qty = require('js-quantities');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "unit-converter" is now active!');
	vscode.workspace.onDidChangeTextDocument(didChangeTextDocument);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('unit-converter.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from unit-converter!');
	});

	context.subscriptions.push(disposable);
}

let unitDecorationType:vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType(
    {
        backgroundColor: 'none',
        light: {
            color: new vscode.ThemeColor("foreground")
        },
        dark: {
            color: new vscode.ThemeColor("foreground")
        },
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
    }
);

function didChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	let e = vscode.window.activeTextEditor; 
	if (e) {
		let doc = e.document;
		let sel = e.selection;
		let lineText = doc.getText(new vscode.Range(sel.start.line, 0, sel.start.line, sel.start.character))+" ";
		let myRegexp = /convert (.*?) to (.*)/g;
		let match = myRegexp.exec(lineText);

		e.setDecorations(unitDecorationType, []);
		if (match) {
			let from = match[1];
			let to = match[2];

			if (to === '') {
				// user is probably still typing
				return;
			}
			let qty =Qty(from);

			let converted:any;
			try {
				converted = qty.to(to);
			} catch (error:any){
				converted = error.message;
			}

			let decoration: vscode.DecorationOptions = {
				"range": new vscode.Range(
					doc.lineAt(sel.start.line).range.end.line,
					doc.lineAt(sel.start.line).range.end.character,
					doc.lineAt(sel.start.line).range.end.line,
					doc.lineAt(sel.start.line).range.end.character+100),
				"renderOptions": {
					"after" : {
						"contentText": converted.toString(),
						"color": "foreground",
						"margin": "20px",
						"fontStyle": "italic"
					}
				}
			};

			e.setDecorations(unitDecorationType, [decoration]);

			// vscode.window.showInformationMessage(converted.toString());
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
