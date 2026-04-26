# Quickstart

> 👏 Welcome to HopCode!

This quickstart guide will have you using AI-powered coding assistance in just a few minutes. By the end, you'll understand how to use HopCode for common development tasks.

## Before you begin

Make sure you have:

- A **terminal** or command prompt open
- A code project to work with
- An API key from Alibaba Cloud Model Studio ([Beijing](https://bailian.console.aliyun.com/) / [intl](https://modelstudio.console.alibabacloud.com/)), or an Alibaba Cloud Coding Plan ([Beijing](https://bailian.console.aliyun.com/cn-beijing/?tab=coding-plan#/efm/coding-plan-index) / [intl](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index)) subscription

## Step 1: Install HopCode

Install HopCode from npm. Native installers and Homebrew packages are not published by this repository yet.

**Prerequisites**

Make sure you have Node.js 20 or later installed. Download it from [nodejs.org](https://nodejs.org/en/download).

```bash
npm install -g @hoptrendy/hopcode-cli@latest
```

## Step 2: Set up authentication

When you start an interactive session with the `hopcode` command, you'll be prompted to configure authentication:

```bash
# You'll be prompted to set up authentication on first use
hopcode
```

```bash
# Or run /auth anytime to change authentication method
/auth
```

Choose your preferred authentication method:

- **Alibaba Cloud Coding Plan**: Select `Alibaba Cloud Coding Plan` for a fixed monthly fee with diverse model options. See the [Coding Plan guide](https://bailian.console.aliyun.com/cn-beijing/?tab=coding-plan#/efm/coding-plan-index) ([intl](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index)) for setup instructions.
- **API Key**: Select `API Key`, then enter your API key from Alibaba Cloud Model Studio ([Beijing](https://bailian.console.aliyun.com/) / [intl](https://modelstudio.console.alibabacloud.com/)). See the API setup guide ([Beijing](https://bailian.console.aliyun.com/cn-beijing/?tab=doc#/doc/?type=model&url=3023091) / [intl](https://modelstudio.console.alibabacloud.com/ap-southeast-1?tab=doc#/doc/?type=model&url=2974721)) for details.

> ⚠️ **Note**: Qwen OAuth was discontinued on April 15, 2026. If you were previously using Qwen OAuth, please switch to one of the methods above.

> [!note]
>
> HopCode stores local settings under `~/.hopcode`.

> [!tip]
>
> You can also configure authentication directly from the terminal without starting a session by running `hopcode auth`. Use `hopcode auth status` to check your current configuration at any time. See the [Authentication](./configuration/auth) page for details.

## Step 3: Start your first session

Open your terminal in any project directory and start HopCode:

```bash
# optiona
cd /path/to/your/project
# start HopCode
hopcode
```

You'll see the HopCode welcome screen with your session information, recent conversations, and latest updates. Type `/help` for available commands.

## Chat with HopCode

### Ask your first question

HopCode will analyze your files and provide a summary. You can also ask more specific questions:

```
explain the folder structure
```

You can also ask HopCode about its own capabilities:

```
what can HopCode do?
```

> [!note]
>
> HopCode reads your files as needed - you don't have to manually add context. HopCode also has access to its own documentation and can answer questions about its features and capabilities.

### Make your first code change

Now let's make HopCode do some actual coding. Try a simple task:

```
add a hello world function to the main file
```

HopCode will:

1. Find the appropriate file
2. Show you the proposed changes
3. Ask for your approval
4. Make the edit

> [!note]
>
> HopCode always asks for permission before modifying files. You can approve individual changes or enable "Accept all" mode for a session.

### Use Git with HopCode

HopCode makes Git operations conversational:

```
what files have I changed?
```

```
commit my changes with a descriptive message
```

You can also prompt for more complex Git operations:

```
create a new branch called feature/quickstart
```

```
show me the last 5 commits
```

```
help me resolve merge conflicts
```

### Fix a bug or add a feature

HopCode is proficient at debugging and feature implementation.

Describe what you want in natural language:

```
add input validation to the user registration form
```

Or fix existing issues:

```
there's a bug where users can submit empty forms - fix it
```

HopCode will:

- Locate the relevant code
- Understand the context
- Implement a solution
- Run tests if available

### Test out other common workflows

There are a number of ways to work with HopCode:

**Refactor code**

```
refactor the authentication module to use async/await instead of callbacks
```

**Write tests**

```
write unit tests for the calculator functions
```

**Update documentation**

```
update the README with installation instructions
```

**Code review**

```
review my changes and suggest improvements
```

> [!tip]
>
> **Remember**: HopCode is your AI pair programmer. Talk to it like you would a helpful colleague - describe what you want to achieve, and it will help you get there.

## Essential commands

Here are the most important commands for daily use:

| Command               | What it does                                     | Example                       |
| --------------------- | ------------------------------------------------ | ----------------------------- |
| `hopcode`             | start HopCode                                    | `hopcode`                     |
| `/auth`               | Change authentication method (in session)        | `/auth`                       |
| `hopcode auth`        | Configure authentication from the terminal       | `hopcode auth`                |
| `hopcode auth status` | Check current authentication status              | `hopcode auth status`         |
| `/help`               | Display help information for available commands  | `/help` or `/?`               |
| `/compress`           | Replace chat history with summary to save Tokens | `/compress`                   |
| `/clear`              | Clear terminal screen content                    | `/clear` (shortcut: `Ctrl+L`) |
| `/theme`              | Change HopCode visual theme                      | `/theme`                      |
| `/language`           | View or change language settings                 | `/language`                   |
| → `ui [language]`     | Set UI interface language                        | `/language ui zh-CN`          |
| → `output [language]` | Set LLM output language                          | `/language output Chinese`    |
| `/quit`               | Exit HopCode immediately                         | `/quit` or `/exit`            |

See the [CLI reference](./features/commands) for a complete list of commands.

## Pro tips for beginners

**Be specific with your requests**

- Instead of: "fix the bug"
- Try: "fix the login bug where users see a blank screen after entering wrong credentials"

**Use step-by-step instructions**

- Break complex tasks into steps:

```
1. create a new database table for user profiles
2. create an API endpoint to get and update user profiles
3. build a webpage that allows users to see and edit their information
```

**Let HopCode explore first**

- Before making changes, let HopCode understand your code:

```
analyze the database schema
```

```
build a dashboard showing products that are most frequently returned by our UK customers
```

**Save time with shortcuts**

- Press `?` to see all available keyboard shortcuts
- Use Tab for command completion
- Press ↑ for command history
- Type `/` to see all slash commands

## Getting help

- **In HopCode**: Type `/help` or ask "how do I..."
- **Documentation**: You're here! Browse other guides
- **Community**: Join our [GitHub Discussion](https://github.com/QwenLM/hopcode/discussions) for tips and support
