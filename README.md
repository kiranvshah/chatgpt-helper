# ChatGPT Helper

This is an extension to quickly query OpenAI's [ChatGPT](https://openai.com/blog/chatgpt/) from VS Code.

## Features

### Ask why your code's not working

Use the "ChatGPT: Ask why code isn't working" command in the Command Palette:

1. Select the code you want to ask about. If you want to ask about the whole file, do not select any text.
2. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
3. Begin typing `ChatGPT: Ask why code isn't working`, and select it when it appears.
4. Wait for the response. It will appear in a new tab.

### Ask to explain your code

Use the "ChatGPT: Ask to explain code" command in the Command Palette:

1. Select the code you want to ask about. If you want to ask about the whole file, do not select any text.
2. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
3. Begin typing `ChatGPT: Ask to explain code`, and select it when it appears.
4. Wait for the response. It will appear in a new tab.

### Ask a free-form question

Use the "ChatGPT: Ask a question" command in the Command Palette:

1. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
2. Begin typing `ChatGPT: Ask a question`, and select it when it appears.
3. Enter the question you'd like to ask.
4. Wait for the response. It will appear in a new tab.

## Configuration

### Session Token

When first querying ChatGPT, you will have to enter your ChatGPT session token. Instructions to find this are as follows:
1. Go to [chat.openai.com/chat](https://chat.openai.com/chat).
2. Press `Ctrl` + `Shift` + `I` (or `Command` + `Option` + `I` on Mac).
3. Open Applications > Cookies > `https://chat.openai.com`.
4. Copy the value of the `__Secure-next-auth.session-token` and paste it where prompted, when querying the AI.

### Changing Query Text

In order to change the message sent to the AI that comes before your code, when running the `Ask ChatGPT about your code`, follow these instructions:

1. `Ctrl` + `,` to open Preferences.
2. Search for `chatgpt`.
3. Change the `chatgpt.queryText` setting to whatever you want.

## Known Issues

*None*