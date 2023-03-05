// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import * as https from "https"

const getCommentOpening = (editor: vscode.TextEditor | undefined) => {
	switch (editor?.document.languageId) {
		case "c":
		case "cpp":
		case "csharp":
		case "cuda-cpp":
		case "objective-c":
		case "objective-cpp":
		case "go":
		case "rust":
		case "java":
		case "scala":
		case "kotlin":
		case "scss":
		case "swift":
		case "typescript":
		case "javascript":
		case "javascriptreact":
		case "coffeescript":
		case "groovy":
		case "php":
			return "/*"
		case "python":
			return '"""'
		case "ruby":
			return "=begin"
		case "perl":
		case "perl6":
			return "=pod"
		case "r":
			return "#"
		default:
			return "/*"
	}
}
const getCommentEnding = (editor: vscode.TextEditor | undefined) => {
	switch (editor?.document.languageId) {
		case "c":
		case "cpp":
		case "csharp":
		case "cuda-cpp":
		case "objective-c":
		case "objective-cpp":
		case "go":
		case "rust":
		case "java":
		case "scala":
		case "kotlin":
		case "scss":
		case "swift":
		case "typescript":
		case "javascript":
		case "javascriptreact":
		case "coffeescript":
		case "groovy":
		case "php":
			return /\*\/$/m
		case "python":
			return /""""$/m
		case "ruby":
			return /=end$/m
		case "perl":
		case "perl6":
			return /=cut$/m
		case "r":
			return /#$/m
		default:
			return /\*\/$/m
	}
}

const sendQueryToOpenAI = async (
	queryText: string,
	openAIKey: string,
	commentClosing?: RegExp,
) => {
	// get user or workspace configuration object
	let config = vscode.workspace.getConfiguration()
	const model = config.get("chatgpt-helper.model") as string | null
	const modelId = model === "chatgpt" ? "gpt-3.5-turbo" : "code-davinci-002"
	const modelNameReadable = model === "chatgpt" ? "ChatGPT" : "Codex"

	const outputDocument = await vscode.workspace.openTextDocument({
		content: `Querying ${modelNameReadable}. This may take some time...`,
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
			path:
				model === "codex" ? "/v1/completions" : "/v1/chat/completions",
			method: "POST",
			headers: {
				"Content-Type": "application/json", // eslint-disable-line @typescript-eslint/naming-convention
				Authorization: `Bearer ${openAIKey}`, // eslint-disable-line @typescript-eslint/naming-convention
			},
		},
		response => {
			response.on("data", data => {
				process.stdout.write(data)
				if (model === "codex") {
					responseText += JSON.parse(
						data.toString(),
					).choices[0].text.trim()
					if (commentClosing) {
						responseText = responseText.replace(commentClosing, "")
					}
				} else {
					responseText += JSON.parse(data.toString()).choices[0]
						.message.content
				}
			})
		},
	)

	request.write(
		JSON.stringify(
			model === "codex"
				? {
						model: "code-davinci-002",
						prompt: entireQueryText,
						temperature: 0.1,
						max_tokens: 512, // eslint-disable-line @typescript-eslint/naming-convention
						frequency_penalty: 0.38, // eslint-disable-line @typescript-eslint/naming-convention
				  }
				: {
						model: "gpt-3.5-turbo",
						max_tokens: 512, // eslint-disable-line @typescript-eslint/naming-convention
						// todo: should subtract length (in tokens) of query
						messages: [
							{
								role: "system",
								content:
									"You are a knowledgeable and helpful assistant called ChatGPT, who is specialised to help answer queries about users' code.",
							},
							{
								role: "user",
								content: entireQueryText,
							},
						],
				  },
		),
	)
	request.end()
	request.on("close", () => {
		// success
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
				`Error querying ${modelNameReadable}.\n\n${error}`,
			)
		})
	})
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const getOpenAIKey = async (forceChange: boolean = false) => {
		const secrets = context.secrets
		const oldOpenAIKey = await secrets.get("openAIKey")
		if (oldOpenAIKey && !forceChange) {
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
				const commentOpening = getCommentOpening(
					vscode.window.activeTextEditor,
				)
				const commentEnding = getCommentEnding(
					vscode.window.activeTextEditor,
				)
				const model = workspaceConfiguration.get(
					"chatgpt-helper.model",
				) as string
				const fullQueryText =
					model === "chatgpt"
						? "Why is the following code not working?\n" +
						  codeToQuery
						: codeToQuery +
						  "\n" +
						  commentOpening +
						  (workspaceConfiguration.get(
								"chatgpt-helper.codex.queries.codeNotWorking",
						  ) as string | null)
				sendQueryToOpenAI(
					fullQueryText,
					await getOpenAIKey(),
					commentEnding,
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
				const commentOpening = getCommentOpening(
					vscode.window.activeTextEditor,
				)
				const commentEnding = getCommentEnding(
					vscode.window.activeTextEditor,
				)
				const model = workspaceConfiguration.get(
					"chatgpt-helper.model",
				) as string
				const fullQueryText =
					model === "chatgpt"
						? "Explain the following code:\n" + codeToQuery
						: codeToQuery +
						  "\n" +
						  commentOpening +
						  (workspaceConfiguration.get(
								"chatgpt-helper.codex.queries.explainCode",
						  ) as string | null)
				sendQueryToOpenAI(
					fullQueryText,
					await getOpenAIKey(),
					commentEnding,
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
				sendQueryToOpenAI(queryText, await getOpenAIKey())
			} else {
				vscode.window.showErrorMessage(
					"No query entered. Did not send to ChatGPT",
				)
			}
		},
	)

	const updateOpenAIKey = vscode.commands.registerCommand(
		"chatgpt-helper.changeOpenAIAPIKey",
		async () => {
			await getOpenAIKey(true)
		},
	)

	context.subscriptions.push(
		askChatGptWhyNotWorking,
		askChatGptToExplainCode,
		askChatGptCustomQuery,
		updateOpenAIKey,
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
