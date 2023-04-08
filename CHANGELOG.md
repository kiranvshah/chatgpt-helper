# Changelog

## 4.0.1

-   Fix error in README relating to how many words $1 can buy

## 4.0.0

-   Remove option to use Codex since it is being deprecated by OpenAI, in favour of `gpt-3.5-turbo`.
    -   Remove option from configuration
    -   Remove all referecences in README and now explain that extension must be paid for
    -   Refer to model as GPT-3.5 instead of ChatGPT in both README and configuraiton
-   Re-add 3.3.0 into changelog, but keep 3.4.0 as well since both have been published

## 3.4.1

-   Update changelog to rename v3.3.0 to v3.4.0 since it was erroneously published under the wrong version number

## 3.4.0

-   This version is identical to 3.3.0, but was erroneously published under the wrong version number

## 3.3.0

-   Add option to use [official ChatGPT API](https://openai.com/blog/introducing-chatgpt-and-whisper-apis)
    -   Add configuration option to change model (`chatgpt-helper.model`)
    -   Update `openai` dependency
    -   Update old Codex query configuration options
        -   Change IDs to be specific to Codex
        -   Update description to specify that they are for Codex only
        -   Fix misspelling of "assistant" in defaults
    -   When using Codex, the model is refferred to as "Codex" instead of "ChatGPT" in the response window
-   Change namespace for configuration options from `chatgptHelper` to `chatgpt-helper` to be in line with rest of extension

## 3.2.1

-   Change marketplace display name from "ChatGPT Helper" to "ChatGPT"
-   Continuous integration: update `actions/setup-node` to v3

## 3.2.0

-   Explanation and debug commands can now be run by right-clicking inside an editor (`editor/context` menu)
-   Remove unnecesary console logging

## 3.1.0

-   Add command to change OpenAI API key once it is already set (`chatgpt-helper.changeOpenAIAPIKey`)

## 3.0.2

-   Fix bug where query for explaining code always used opened comment with `'''` instead of the correct one for the language
-   Remove now unused ChatGPT session token config option
-   Continuous integration: cache pnpm dependencies

## 3.0.1

-   Add `codex` tag to marketplace page
-   Update README to not include strikethrough

## 3.0.0

-   Use Codex instead of ChatGPT
    -   Update query prompts
    -   Remove `chatgpt` dependency
-   Add continuous integration

## 2.0.1

-   Use webpack instead of esbuild
    -   Removes need for npm; solely uses pnpm now
-   Remove unnecessary package @types/puppeteer
-   Add Prettier

## 2.0.0

-   Use [unofficial ChatGPT REST API](https://github.com/transitive-bullshit/chatgpt-api) instead of puppeteer
    -   Add session token configuration option
    -   Remove headless browser configuration option
-   Update README
    -   Remove known issue of session expiration
    -   Remove configuration of OpenAI username & password
    -   Add configuration of ChatGPT session token
    -   Change wording from "package" to "extension" in description
-   Update CHANGELOG formatting
    -   Use inline code blocks
    -   Use `h2` headers for versions
-   Update LICENSE formatting
    -   Remove notes at bottom (how to apply the license)
    -   Add header, including year, name and link to license text
    -   Add `license` field to `package.json`

## 1.1.1

-   Fix typos in changelog

## 1.1.0

-   Add headless configuration option
-   Move changelog from `README.md` to `CHANGELOG.md`

## 1.0.0

-   Initial release
