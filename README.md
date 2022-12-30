# ChatGPT Helper

This is an extension to quickly query OpenAI's [Codex](https://openai.com/blog/openai-codex/), an AI code assistant similar to ChatGPT, from VS Code.

> **Note**  
> Temporarily, the extension is using Codex, a similar model by OpenAI, instead of ChatGPT, since ChatGPT is near impossible to automate at this time.

## Features

### Ask why your code's not working

1. Select the code you want to ask about. If you want to ask about the whole file, do not select any text.
2. Right click inside the editor and select `ChatGPT: Ask why code isn't working`.
3. Wait for the response. It will appear in a new tab.

### Ask to explain your code

1. Select the code you want to ask about. If you want to ask about the whole file, do not select any text.
2. Right click inside the editor and select `ChatGPT: Ask to explain code`.
3. Wait for the response. It will appear in a new tab.

### Ask a free-form question

Use the "ChatGPT: Ask a question" command in the Command Palette:

1. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
2. Begin typing `ChatGPT: Ask a question`, and select it when it appears.
3. Enter the question you'd like to ask.
4. Wait for the response. It will appear in a new tab.

## Authentication

When you first query Codex, you will be prompted to enter an OpenAI API key. This is used by the extension to access the API and is only sent to OpenAI. Codex is currently free, so does not use up any credits on your account.

To find your OpenAI API key:

1. Go to https://beta.openai.com/account/api-keys. You will need to log in (or sign up) to your OpenAI account.
2. Click "Create new secret key", and copy it.
3. You should then paste it into VS Code when prompted.

### Changing API key

Once your OpenAI API key has been set you can update it using the "ChatGPT: Change OpenAI API key" command in the Command Palette:

1. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
2. Begin typing `ChatGPT: Change OpenAI API key`, and select it when it appears.
3. Enter your OpenAI API key (see above instructions on how to find).

## Configuration

### Changing Query Text

In order to change the message sent to the AI that comes before your code, when running the `Ask ChatGPT about your code`, follow these instructions:

1. `Ctrl` + `,` to open Preferences.
2. Search for `chatgpt`.
3. Change the `chatgpt.queryText` setting to whatever you want.

## Known Issues

_None_
