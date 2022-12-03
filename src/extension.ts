// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import puppeteer from 'puppeteer';


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

	const askChatGPT = vscode.commands.registerCommand('chatgpt-helper.askChatGPT', async () => {
		// code placed here will be executed every time command is executed
		
		// store selected code in a variable named selectedCode
		const selectedCode = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);

		// store entire file contents in a variable too
		const entireFileContents = vscode.window.activeTextEditor?.document.getText();

		const codeToQuery = selectedCode || entireFileContents;

		if (codeToQuery) {
			const outputDocument = await vscode.workspace.openTextDocument({ content: 'Querying ChatGPT with selected code...', language: "markdown" });
			const outputDocumentEditor = await vscode.window.showTextDocument(outputDocument, { viewColumn: vscode.ViewColumn.Beside }); // open in split view

			const workspaceConfiguration = vscode.workspace.getConfiguration();
			
			const entireQueryText = workspaceConfiguration.get("chatgpt-helper.queries.queryText") as string | null + '\n' + codeToQuery;
			const openaiEmail = workspaceConfiguration.get("chatgpt-helper.authentication.OpenaiEmail") as string | null;
			const openaiPassword = workspaceConfiguration.get("chatgpt-helper.authentication.OpenaiPassword")  as string | null;

			// todo: query chatgpt 
			const browser = await puppeteer.launch({ userDataDir: '/tmp/myChromeSession', headless: true }); // change headless to false to see the browser
			const page = await browser.newPage();

			await page.goto("https://chat.openai.com/chat");
			
			if (page.url() === "https://chat.openai.com/auth/login") {
				if (!openaiEmail || !openaiPassword) {
					vscode.window.showErrorMessage("OpenAI email and password not set in settings.json");
					return;
				}

				// click login button
				await page.click("button"); // first button on page is login button
				await page.waitForNavigation(); // wait for page redirect
				await page.type("input#username", openaiEmail as string); // enter email
				await page.click("button"); // click continue button
				await page.waitForSelector("input#password"); // wait for page load
				await page.type("input#password", openaiPassword as string); // enter password
				await page.click("button[type=submit]"); // click continue button
				await page.waitForNavigation(); // wait for page redirect

				if (page.url() !== "https://chat.openai.com/auth/login") {
					vscode.window.showErrorMessage("OpenAI email and/or password incorrect. Could not log in.");
					return;
				}
			}

			// should be successfully logged in now
			// todo: a tutorial may show at this point. it should be dismissed.

			await page.waitForSelector("textarea"); // wait for page load
			for (const line of entireQueryText.split("\n")) {
				await page.type("textarea", line);
				await page.keyboard.down("Shift");
				await page.keyboard.press("Enter");
				await page.keyboard.up("Shift");
			}
			await page.keyboard.press("Enter"); // press enter to send query

			// todo: get response from div.markdown.prose and return to user
			await page.waitForSelector("path[d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3']"); // wait for like button
			const response = (await page.$eval("div.markdown.prose", el => el.textContent)).replace("Copy code", "\n");
			console.log("response", response);

			outputDocumentEditor.edit((editBuilder) => {
				editBuilder.replace(
					new vscode.Range(
						new vscode.Position(0, 0),
						new vscode.Position(99999999999999, 0)
					),
					response
				);
			});

		} else {
			vscode.window.showErrorMessage('No code selected or file is empty. Did not send to ChatGPT');
		}

	});

	context.subscriptions.push(disposable, askChatGPT);
}

// This method is called when your extension is deactivated
export function deactivate() {}
