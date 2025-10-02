Configure TaskMaster to use Cursor as the primary AI provider.

## Cursor Provider Configuration

This command configures TaskMaster to use Cursor IDE as the main AI provider instead of external API services.

## Execution

```bash
task-master models --provider=cursor --setup
```

## Configuration Process

### 1. Verify Cursor Installation

- Check if Cursor IDE is installed
- Verify MCP is enabled in Cursor settings
- Confirm TaskMaster MCP server is configured

### 2. Update TaskMaster Configuration

Updates `.taskmaster/config.json`:

```json
{
  "models": {
    "main": {
      "provider": "cursor",
      "modelId": "claude-3-5-sonnet",
      "maxTokens": 64000,
      "temperature": 0.2
    },
    "research": {
      "provider": "cursor",
      "modelId": "claude-3-5-sonnet",
      "maxTokens": 32000,
      "temperature": 0.1
    },
    "fallback": {
      "provider": "cursor",
      "modelId": "claude-3-5-sonnet",
      "maxTokens": 64000,
      "temperature": 0.2
    }
  },
  "cursor": {
    "enabled": true,
    "mcpServerName": "task-master-ai",
    "defaultModel": "claude-3-5-sonnet",
    "timeout": 120000
  }
}
```

### 3. Test Configuration

- Verify MCP connection to Cursor
- Test basic TaskMaster commands
- Confirm task generation works

## Benefits

- **No API Keys Required** - Uses Cursor subscription
- **Integrated Experience** - Work directly in IDE
- **Cost Effective** - No additional API costs
- **Context Aware** - Full codebase understanding

## Requirements

- Cursor IDE with active subscription
- MCP enabled in Cursor settings
- TaskMaster MCP server configured
- Project initialized with `task-master init`

## Post-Configuration

After setup:

1. Test with: `task-master next`
2. Verify task generation: `task-master add-task --prompt="test"`
3. Check MCP tools work in Cursor chat

## Troubleshooting

**Connection Issues:**

- Restart Cursor IDE
- Check MCP server status
- Verify TaskMaster installation

**Command Failures:**

- Ensure project is initialized
- Check `.taskmaster/config.json` exists
- Verify MCP permissions
