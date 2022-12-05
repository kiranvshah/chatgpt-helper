// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import puppeteer from 'puppeteer';

const sendQueryToChatGPT = async (queryText: string) => {
	const outputDocument = await vscode.workspace.openTextDocument({ content: 'Querying ChatGPT. This may take some time...', language: "markdown" });
	const outputDocumentEditor = await vscode.window.showTextDocument(outputDocument, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true, preview: true }); // open in split view
	
	const entireQueryText = (queryText).split("\r\n").join("\n");

	// query chatgpt 
	const browser = await puppeteer.launch({ userDataDir: '/chatgpt-helper/chromedata', headless: true }); // change headless to false to see the browser
	const page = await browser.newPage();

	await page.goto("https://chat.openai.com/chat");
	
	if (page.url() === "https://chat.openai.com/auth/login") {
		const openaiEmail = await vscode.window.showInputBox({title: "OpenAI Email", prompt: "Enter the email address associated with your OpenAI account.  This will be stored locally on your machine, and never be shared with anyone except OpenAI. You are responsible for all data sent to OpenAI and the use of its services under your account.", placeHolder: "OpenAI Email"});
		const openaiPassword = await vscode.window.showInputBox({title: "OpenAI Password", prompt: "Enter the password for your OpenAI account.  This will be stored locally on your machine, and never be shared with anyone except OpenAI. You are responsible for all data sent to OpenAI and the use of its services under your account.", password: true, placeHolder: "OpenAI Password"});

		// check email is valid
		if (!openaiEmail || !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(openaiEmail)) {
			// show error and return
			vscode.window.showErrorMessage("Invalid email provided. Cancelled.");
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

		if (await page.evaluate(() => document.body.innerText.includes("Wrong email or password"))) {
			vscode.window.showErrorMessage("OpenAI email and/or password incorrect. Could not log in.");
			return;
		}
	}

	// should be successfully logged in now
	// a tutorial may show at this point. it is unimportant however, since the code can work beneath the modal

	await page.waitForSelector("textarea"); // wait for page load
	for (const line of entireQueryText.split("\n")) {
		await page.type("textarea", line);
		await page.keyboard.down("Shift");
		await page.keyboard.press("Enter");
		await page.keyboard.up("Shift");
	}
	await page.keyboard.press("Enter"); // press enter to send query

	// get response from div.markdown.prose and return to user
	await page.waitForSelector("path[d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3']"); // wait for like button
	const response = (await page.evaluate(() => {
		const elements = document.querySelector("div.markdown.prose")!.children;
		let buildingResponse = "";
		for (const e of elements) {
			buildingResponse += e.textContent;
			buildingResponse += "\n";
		}
		return buildingResponse;
	})).split("Copy code").join("\n");


	outputDocumentEditor.edit((editBuilder) => {
		editBuilder.replace(
			new vscode.Range(
				new vscode.Position(0, 0),
				new vscode.Position(99999999999999, 0)
			),
			response
		);
	});
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const askChatGPT = vscode.commands.registerCommand('chatgpt-helper.askChatGPT', async () => {
		// code placed here will be executed every time command is executed
		
		// store selected code in a variable named selectedCode
		const selectedCode = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);

		// store entire file contents in a variable too
		const entireFileContents = vscode.window.activeTextEditor?.document.getText();

		const codeToQuery = selectedCode || entireFileContents;

		if (codeToQuery) {
			const workspaceConfiguration = vscode.workspace.getConfiguration();
			sendQueryToChatGPT(workspaceConfiguration.get("chatgptHelper.queries.queryText") as string | null + '\n' + codeToQuery);

		} else {
			vscode.window.showErrorMessage('No code selected or file is empty. Did not send to ChatGPT');
		}

	});

	context.subscriptions.push(askChatGPT);
}

// This method is called when your extension is deactivated
export function deactivate() {}
