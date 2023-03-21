# ChatGPT Helper

This is an extension to quickly query OpenAI's [ChatGPT](https://openai.com/blog/chatgpt) (GPT-3.5) from VS Code.

GPT-3.5, which powers ChatGPT, is a large language model designed to answer general queries. The official GPT-3.5 API costs $0.002 / 1K tokens, where 1,000 tokens is approximately 750 words, so **$1 would buy approximately 2 million words**.

To use this extension, you must provide an OpenAI API token linked to an account with billing set up; costs for using the API are charged directly to your OpenAI account.

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

When you first query ChatGPT, you will be prompted to enter an OpenAI API key. This is used by the extension to access the API and is only sent to OpenAI.

To find your OpenAI API key:

1. Go to https://platform.openai.com/account/api-keys. You will need to log in (or sign up) to your OpenAI account.
2. Click "Create new secret key", and copy it.
3. You should then paste it into VS Code when prompted.

You must also have billing set up on your OpenAI account (see [Pricing](#pricing) below).

### Changing API key

Once your OpenAI API key has been set you can update it using the "ChatGPT: Change OpenAI API key" command in the Command Palette:

1. Press `Ctrl` + `Shift` + `P` to open the Command Palette.
2. Begin typing `ChatGPT: Change OpenAI API key`, and select it when it appears.
3. Enter your OpenAI API key (see above instructions on how to find).

### Pricing

The ChatGPT API is charged by OpenAI at $0.002 / 1K tokens, charged directly to your OpenAI account. To use this extension, you must set up billing on your account. Find more info about pricing at https://openai.com/pricing#chat.
