# ChatGPT Helper

This is a package to quickly query OpenAI's [ChatGPT](https://openai.com/blog/chatgpt/) from VS Code.

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

When first querying ChatGPT, you will have to enter your OpenAI username and password so the extension can access ChatGPT.

> Your OpenAI username and password will never be shared with anyone except OpenAI, when logging into your account to query ChatGPT. You are responsible for all data sent to OpenAI and the use of its services under your account.

### Changing Query Text

In order to change the message sent to the AI that comes before your code, when running the `Ask ChatGPT about your code`, follow these instructions:

1. `Ctrl` + `,` to open Preferences.
2. Search for `chatgpt`.
3. Change the `chatgpt.queryText` setting to whatever you want.

## Known Issues

*None*

## Release Notes

### 1.0.0

Initial release.