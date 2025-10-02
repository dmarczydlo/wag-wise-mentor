Set up TaskMaster to work with Cursor IDE as an AI provider.

## Cursor Integration Overview

Cursor IDE can be used as an alternative to Claude for TaskMaster operations through MCP (Model Context Protocol) integration.

## Prerequisites

1. **Cursor IDE Installed**

   - Download from [cursor.sh](https://cursor.sh)
   - Ensure you have an active Cursor subscription

2. **TaskMaster Installed**
   ```bash
   npm install -g task-master-ai
   ```

## Configuration Steps

### 1. Configure Cursor MCP Settings

Open Cursor Settings (Cmd/Ctrl + ,) and navigate to **Features** → **MCP**.

Add the following MCP server configuration:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "CURSOR_ENABLED": "true",
        "CURSOR_MCP_SERVER": "task-master-ai"
      }
    }
  }
}
```

### 2. Enable TaskMaster in Cursor

1. In Cursor Settings, go to **Features** → **MCP**
2. Toggle **Enable MCP** to `true`
3. Enable the `task-master-ai` server
4. Restart Cursor IDE

### 3. Initialize TaskMaster in Your Project

In Cursor's AI chat pane, run:

```
Initialize taskmaster-ai in my project
```

Or use the command palette (Cmd/Ctrl + Shift + P) and search for "TaskMaster".

## Usage in Cursor

### Available Commands

Once configured, you can use TaskMaster commands directly in Cursor's AI chat:

```
# Project setup
task-master init
task-master parse-prd .taskmaster/docs/prd.txt

# Daily workflow
task-master next
task-master show 1.2
task-master set-status --id=1.2 --status=done

# Task management
task-master add-task --prompt="Add new feature"
task-master expand --id=1 --research
```

### MCP Tools Available

TaskMaster provides these MCP tools in Cursor:

- `help` - Show available commands
- `initialize_project` - Initialize TaskMaster
- `get_tasks` - List all tasks
- `next_task` - Get next available task
- `get_task` - Show task details
- `set_task_status` - Update task status
- `add_task` - Add new task
- `expand_task` - Break task into subtasks
- `update_task` - Update task details

## Benefits of Using Cursor

1. **Integrated Experience** - Work directly in your IDE
2. **No API Keys Required** - Uses your Cursor subscription
3. **Context Awareness** - Cursor understands your codebase
4. **Real-time Collaboration** - Share context with AI assistant

## Troubleshooting

**MCP Server Not Connecting:**

- Verify TaskMaster is installed globally
- Check Cursor MCP settings are enabled
- Restart Cursor IDE

**Commands Not Working:**

- Ensure project is initialized with `task-master init`
- Check `.taskmaster/config.json` exists
- Verify MCP server is running in Cursor

**Permission Issues:**

- Ensure Cursor has necessary permissions
- Check file system access for project directory

## Next Steps

After setup:

1. Initialize your project: `task-master init`
2. Parse your PRD: `task-master parse-prd docs/prd.txt`
3. Start working: `task-master next`
