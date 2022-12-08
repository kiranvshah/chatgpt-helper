// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChatGPTAPI } from 'chatgpt';

const sendQueryToChatGPT = async (queryText: string) => {
	// get user or workspace configuration object
	let config = vscode.workspace.getConfiguration();

	const getSessionToken = () => config.get("chatgptHelper.sessionToken") as string;

	const outputDocument = await vscode.workspace.openTextDocument({ content: 'Querying ChatGPT. This may take some time...', language: "markdown" });
	const outputDocumentEditor = await vscode.window.showTextDocument(outputDocument, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true, preview: true }); // open in split view
	
	const entireQueryText = (queryText).split("\r\n").join("\n");

	if (!getSessionToken()) {
		// update session token
		await config.update("chatgptHelper.sessionToken", await vscode.window.showInputBox({title: "ChatGPT Session Token", prompt: "Go to chat.openai.com/chat. Press Ctrl+Shift+I (or Command+Option+I on Mac). Open Applications > Cookies > https://chat.openai.com. Copy the value of the `__Secure-next-auth.session-token` and paste it here.", placeHolder: "ChatGPT Session Token", ignoreFocusOut: true}), vscode.ConfigurationTarget.Global);;
		// update config var
		config = vscode.workspace.getConfiguration();
	}

	try {
		// query chatgpt
		const api = new ChatGPTAPI({ sessionToken: getSessionToken() });
		await api.ensureAuth();

		const response = await api.sendMessage(entireQueryText);

		outputDocumentEditor.edit((editBuilder) => {
			editBuilder.replace(
				new vscode.Range(
					new vscode.Position(0, 0),
					new vscode.Position(99999999999999, 0)
				),
				response
			);
		});
	} catch (error) {
		outputDocumentEditor.edit((editBuilder) => {
			editBuilder.replace(
				new vscode.Range(
					new vscode.Position(0, 0),
					new vscode.Position(99999999999999, 0)
				),
				`Error querying ChatGPT. Try updating your session token?\n\n${error}`
			);
		});
	}
	
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const askChatGptWhyNotWorking = vscode.commands.registerCommand('chatgpt-helper.askChatGptWhyNotWorking', () => {
		// code placed here will be executed every time command is executed
		
		// store selected code in a variable named selectedCode
		const selectedCode = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);

		// store entire file contents in a variable too
		const entireFileContents = vscode.window.activeTextEditor?.document.getText();

		const codeToQuery = selectedCode || entireFileContents;

		if (codeToQuery) {
			const workspaceConfiguration = vscode.workspace.getConfiguration();
			sendQueryToChatGPT(workspaceConfiguration.get("chatgptHelper.queries.queryCodeNotWorking") as string | null + '\n' + codeToQuery);

		} else {
			vscode.window.showErrorMessage('No code selected or file is empty. Did not send to ChatGPT');
		}

	});

	const askChatGptToExplainCode = vscode.commands.registerCommand('chatgpt-helper.askChatGptToExplainCode', () => {
		// code placed here will be executed every time command is executed
		
		// store selected code in a variable named selectedCode
		const selectedCode = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);

		// store entire file contents in a variable too
		const entireFileContents = vscode.window.activeTextEditor?.document.getText();

		const codeToQuery = selectedCode || entireFileContents;

		if (codeToQuery) {
			const workspaceConfiguration = vscode.workspace.getConfiguration();
			sendQueryToChatGPT(workspaceConfiguration.get("chatgptHelper.queries.queryExplainCode") as string | null + '\n' + codeToQuery);

		} else {
			vscode.window.showErrorMessage('No code selected or file is empty. Did not send to ChatGPT');
		}

	});

	const askChatGptCustomQuery = vscode.commands.registerCommand('chatgpt-helper.askChatGptCustomQuery', async () => {
		const queryText = await vscode.window.showInputBox({title: "ChatGPT Query", prompt: "Enter question for ChatGPT.", placeHolder: "Query"});
		if (queryText) {
			sendQueryToChatGPT(queryText);
		} else {
			vscode.window.showErrorMessage('No query entered. Did not send to ChatGPT');
		}
	});


	context.subscriptions.push(askChatGptWhyNotWorking, askChatGptToExplainCode, askChatGptCustomQuery);
}

// This method is called when your extension is deactivated
export function deactivate() {}
