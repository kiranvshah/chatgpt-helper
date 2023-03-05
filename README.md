# ChatGPT Helper

This is an extension to quickly query OpenAI's [ChatGPT](https://openai.com/blog/chatgpt) or [Codex](https://openai.com/blog/openai-codex/) from VS Code.

ChatGPT is a large language model designed to answer general queries. The official ChatGPT API costs $0.002 / 1K tokens, where 1,000 tokens is approximately 750 words, so **$1 would buy approximately 2 million words**. To use this extension, you must provide an OpenAI API token; costs for using the API are charged directly to your OpenAI account.

Alternatively, you can use Codex - another model by OpenAI specialised for code. This is the model used by GitHub Copilot. Codex is entirely free but still requires an API token in order to use.

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

1. Go to https://platform.openai.com/account/api-keys. You will need to log in (or sign up) to your OpenAI account.
2. Click "Create new secret key", and copy it.
3. You should then paste it into VS Code when prompted.

### Changing API key

Once your OpenAI API key has been set you can update it using the "ChatGPT: Change OpenAI API key" command in the Command Palette:

1. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
2. Begin typing `ChatGPT: Change OpenAI API key`, and select it when it appears.
3. Enter your OpenAI API key (see above instructions on how to find).

### Pricing

While Codex (default) is entirely free, the ChatGPT API is charged by OpenAI at $0.002 / 1K tokens, charged directly to your OpenAI account. To use the ChatGPT model, you must set up billing on your account. Find more info about pricing at https://openai.com/pricing#chat.

## Configuration

### Switching Between Models

In order to switch the model between Codex (default, free) and ChatGPT (paid), follow these instructions:

1. `Ctrl` + `,` to open Preferences.
2. Search for `chatgpt-helper.model`.
3. Use the dropdown to switch between Codex and ChatGPT.

### Changing Query Text

> **Note**  
> Currently, this is only available for the Codex model.

In order to change the prompt sent to the AI that comes alongside your code, when running the code explanation/debug comnmands, follow these instructions:

1. `Ctrl` + `,` to open Preferences.
2. Search for `chatgpt-helper`.
3. Change the relevant settings under `Codex > Queries` to whatever you want.
