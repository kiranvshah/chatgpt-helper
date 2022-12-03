// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chatgpt-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('chatgpt-helper.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ChatGPT Helper!');
	});

	const askChatGPT = vscode.commands.registerCommand('chatgpt-helper.askChatGPT', () => {
		// code placed here will be executed every time command is executed
		
		// store selected code in a variable named selectedCode
		const selectedCode = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);

		// store entire file contents in a variable too
		const entireFileContents = vscode.window.activeTextEditor?.document.getText();

		const codeToQuery = selectedCode || entireFileContents;

		if (codeToQuery) {
			vscode.window.showInformationMessage('Querying ChatGPT with selected code...');

			const workspaceConfiguration = vscode.workspace.getConfiguration();
			
			const entireQueryText = workspaceConfiguration.get("chatgpt-helper.queries.queryText") + '\n' + codeToQuery;
			const openaiEmail = workspaceConfiguration.get("chatgpt-helper.authentication.OpenaiEmail");
			const openaiPassword = workspaceConfiguration.get("chatgpt-helper.authentication.OpenaiPassword");

			// todo: query chatgpt 
		} else {
			vscode.window.showErrorMessage('No code selected or file is empty. Did not send to ChatGPT');
		}

	});

	context.subscriptions.push(disposable, askChatGPT);
}

// This method is called when your extension is deactivated
export function deactivate() {}
