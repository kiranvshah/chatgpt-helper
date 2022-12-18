// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import * as https from "https"

const sendQueryToChatGPT = async (queryText: string, openAIKey: string) => {
	// get user or workspace configuration object
	let config = vscode.workspace.getConfiguration()

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

	let responseText = ""
	const request = https.request(
		{
			hostname: "api.openai.com",
			path: "/v1/completions",
			method: "POST",
			headers: {
				"Content-Type": "application/json", // eslint-disable-line @typescript-eslint/naming-convention
				Authorization: `Bearer ${openAIKey}`, // eslint-disable-line @typescript-eslint/naming-convention
			},
		},
		response => {
			response.on("data", data => {
				process.stdout.write(data)
				console.log(
					"DATA",
					data,
					JSON.parse(data.toString()),
					JSON.parse(data.toString()).choices[0].text,
				)
				responseText += JSON.parse(data.toString())
					.choices[0].text.trim()
					.replace(/'''$/, "")
			})
		},
	)

	request.write(
		JSON.stringify({
			model: "code-davinci-002",
			prompt: entireQueryText,
			temperature: 0.1,
			max_tokens: 512, // eslint-disable-line @typescript-eslint/naming-convention
			frequency_penalty: 0.38, // eslint-disable-line @typescript-eslint/naming-convention
		}),
	)
	request.end()
	request.on("close", () => {
		// success
		console.log("RESPONSE", responseText)
		outputDocumentEditor.edit(editBuilder => {
			editBuilder.replace(
				new vscode.Range(
					new vscode.Position(0, 0),
					new vscode.Position(99999999999999, 0),
				),
				`${responseText}`,
			)
		})
	})
	request.on("error", error => {
		console.error(error)
		outputDocumentEditor.edit(editBuilder => {
			editBuilder.replace(
				new vscode.Range(
					new vscode.Position(0, 0),
					new vscode.Position(99999999999999, 0),
				),
				`Error querying ChatGPT.\n\n${error}`,
			)
		})
	})
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const getOpenAIKey = async () => {
		const secrets = context.secrets
		const oldOpenAIKey = await secrets.get("openAIKey")
		if (oldOpenAIKey) {
			return oldOpenAIKey
		}
		const key = await vscode.window.showInputBox({
			title: "OpenAI API Key",
			prompt: "Enter your OpenAI API key. You can find this at beta.openai.com/account/api-keys",
			ignoreFocusOut: true,
			placeHolder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		})
		if (!key) {
			return ""
		}
		secrets.store("openAIKey", key)
		return key
	}

	const askChatGptWhyNotWorking = vscode.commands.registerCommand(
		"chatgpt-helper.askChatGptWhyNotWorking",
		async () => {
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
					codeToQuery +
						"\n" +
						"'''" +
						(workspaceConfiguration.get(
							"chatgptHelper.queries.queryCodeNotWorking",
						) as string | null),
					await getOpenAIKey(),
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
		async () => {
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
					codeToQuery +
						"\n" +
						"'''" +
						(workspaceConfiguration.get(
							"chatgptHelper.queries.queryExplainCode",
						) as string | null),
					await getOpenAIKey(),
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
				sendQueryToChatGPT(queryText, await getOpenAIKey())
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
