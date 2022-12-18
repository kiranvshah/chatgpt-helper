// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import { ChatGPTAPI } from "chatgpt"
import puppeteer from "puppeteer"

interface GetOpenAIAuthResponse {
	sessionToken?: string
	clearanceToken: string
}
const getOpenAIAuth = async () => {
	const browser = await puppeteer.launch({
		userDataDir: "/chatgpt-helper/chromedata",
		headless: false, // so user can get past cloudflare
	}) // change headless to false to see the browser
	const page = await browser.newPage()

	await page.goto("https://chat.openai.com/chat")

	if (page.url() === "https://chat.openai.com/auth/login") {
		// make user login themselves in chrome window
	}

	console.log(page.cookies())

	return {} as GetOpenAIAuthResponse
}

const sendQueryToChatGPT = async (queryText: string) => {
	// get user or workspace configuration object
	let config = vscode.workspace.getConfiguration()

	const getSessionToken = () =>
		config.get("chatgptHelper.openaiAuth.sessionToken") as string

	const getClearanceToken = () =>
		config.get("chatgptHelper.openaiAuth.clearanceToken") as string

	const updateBothAuthTokens = async () => {
		const openAIAuth = (await getOpenAIAuth()) as GetOpenAIAuthResponse
		config.update(
			"chatgptHelper.openaiAuth.sessionToken",
			openAIAuth.sessionToken,
		)
		config.update(
			"chatgptHelper.openaiAuth.clearanceToken",
			openAIAuth.clearanceToken,
		)
		config = vscode.workspace.getConfiguration()
	}

	const updateClearanceTokenOnly = async () =>
		((await getOpenAIAuth()) as GetOpenAIAuthResponse).clearanceToken

	const outputDocument = await vscode.workspace.openTextDocument({
		content: "Querying ChatGPT. This may take some time...",
		language: "markdown",
	})
	const outputDocumentEditor = await vscode.window.showTextDocument(
		outputDocument,
		{
			viewColumn: vscode.ViewColumn.Beside,
			preserveFocus: true,
			preview: true,
		},
	) // open in split view

	const entireQueryText = queryText.split("\r\n").join("\n")

	if (!getSessionToken()) {
		await updateBothAuthTokens()
	} else if (!getClearanceToken()) {
		await updateClearanceTokenOnly()
	}
	// if clearance token is invalid, the value will still be there so we will find through the try/catch

	// runs twice: if caught the first time, clearance token will be updated
	for (const runNum of [1, 2]) {
		try {
			// query chatgpt
			const api = new ChatGPTAPI({
				sessionToken: getSessionToken(),
				clearanceToken: getClearanceToken(),
			})
			await api.ensureAuth()

			const response = await api.sendMessage(entireQueryText)

			outputDocumentEditor.edit(editBuilder => {
				editBuilder.replace(
					new vscode.Range(
						new vscode.Position(0, 0),
						new vscode.Position(99999999999999, 0),
					),
					response,
				)
			})
			return // success - dont run loop again!
		} catch (error) {
			if (runNum === 1) {
				// first time running: let's try updating the clearance token
				await updateClearanceTokenOnly()
			} else {
				// second time running: tell the user something went wrong
				outputDocumentEditor.edit(editBuilder => {
					editBuilder.replace(
						new vscode.Range(
							new vscode.Position(0, 0),
							new vscode.Position(99999999999999, 0),
						),
						`Error querying ChatGPT. Try updating your session token?\n\n${error}`,
					)
				})
			}
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const askChatGptWhyNotWorking = vscode.commands.registerCommand(
		"chatgpt-helper.askChatGptWhyNotWorking",
		() => {
			// code placed here will be executed every time command is executed

			// store selected code in a variable named selectedCode
			const selectedCode =
				vscode.window.activeTextEditor?.document.getText(
					vscode.window.activeTextEditor?.selection,
				)

			// store entire file contents in a variable too
			const entireFileContents =
				vscode.window.activeTextEditor?.document.getText()

			const codeToQuery = selectedCode || entireFileContents

			if (codeToQuery) {
				const workspaceConfiguration =
					vscode.workspace.getConfiguration()
				sendQueryToChatGPT(
					(workspaceConfiguration.get(
						"chatgptHelper.queries.queryCodeNotWorking",
					) as string | null) +
						"\n" +
						codeToQuery,
				)
			} else {
				vscode.window.showErrorMessage(
					"No code selected or file is empty. Did not send to ChatGPT",
				)
			}
		},
	)

	const askChatGptToExplainCode = vscode.commands.registerCommand(
		"chatgpt-helper.askChatGptToExplainCode",
		() => {
			// code placed here will be executed every time command is executed

			// store selected code in a variable named selectedCode
			const selectedCode =
				vscode.window.activeTextEditor?.document.getText(
					vscode.window.activeTextEditor?.selection,
				)

			// store entire file contents in a variable too
			const entireFileContents =
				vscode.window.activeTextEditor?.document.getText()

			const codeToQuery = selectedCode || entireFileContents

			if (codeToQuery) {
				const workspaceConfiguration =
					vscode.workspace.getConfiguration()
				sendQueryToChatGPT(
					(workspaceConfiguration.get(
						"chatgptHelper.queries.queryExplainCode",
					) as string | null) +
						"\n" +
						codeToQuery,
				)
			} else {
				vscode.window.showErrorMessage(
					"No code selected or file is empty. Did not send to ChatGPT",
				)
			}
		},
	)

	const askChatGptCustomQuery = vscode.commands.registerCommand(
		"chatgpt-helper.askChatGptCustomQuery",
		async () => {
			const queryText = await vscode.window.showInputBox({
				title: "ChatGPT Query",
				prompt: "Enter question for ChatGPT.",
				placeHolder: "Query",
			})
			if (queryText) {
				sendQueryToChatGPT(queryText)
			} else {
				vscode.window.showErrorMessage(
					"No query entered. Did not send to ChatGPT",
				)
			}
		},
	)

	context.subscriptions.push(
		askChatGptWhyNotWorking,
		askChatGptToExplainCode,
		askChatGptCustomQuery,
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
