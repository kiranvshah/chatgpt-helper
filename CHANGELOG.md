# Changelog

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
