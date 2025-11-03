# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **n8n community node package** for integrating the Romulus API with n8n workflows. Romulus is a communication automation platform that provides robocalls, AI agents, and WhatsApp messaging capabilities.

The package provides two main nodes:
- **Romulus** - Regular node for executing API operations (calls, agents, messenger)
- **RomulusTrigger** - Webhook-based trigger node for Romulus events

## Build and Development Commands

```bash
# Build the project (compiles TypeScript + copies icons)
npm run build

# Development mode with watch (auto-recompiles on changes)
npm run dev

# Format code with Prettier
npm run format

# Lint code
npm run lint

# Fix linting issues automatically
npm run lintfix

# Pre-publish checks (build + strict lint)
npm run prepublishOnly
```

**Note**: The build process uses Gulp to copy icon files (`.png`, `.svg`) from `nodes/` and `credentials/` to the `dist/` folder. n8n requires icons to be in the same directory structure as the compiled node files.

## Architecture

### Node Structure

The package uses n8n's **versioned node architecture** with a version wrapper pattern:

1. **[Romulus.node.ts](nodes/Romulus/Romulus.node.ts)** - Version wrapper that extends `VersionedNodeType`
   - Contains base description (name, icon, group)
   - Routes to versioned implementations via `nodeVersions` map
   - Currently only has V1

2. **[RomulusV1.node.ts](nodes/Romulus/V1/RomulusV1.node.ts)** - Main implementation
   - Handles all resource/operation logic
   - Three resources: `call`, `agent`, `messenger`
   - Each resource has multiple operations (list, start, send, etc.)

3. **[RomulusTrigger.node.ts](nodes/Romulus/RomulusTrigger.node.ts)** - Webhook trigger implementation
   - Manages webhook lifecycle (create, checkExists, delete)
   - Handles two different webhook endpoints: `/webhook-subscriptions` and `/call-tasks/webhook-subscriptions`
   - Events: `robocall`, `AGENT_CALL_COMPLETED`, `AGENT_ACTION_COMPLETED`

### Separation of Concerns

Each resource type has its UI/operation definitions split into separate description files:

- **[CallDescriptions.ts](nodes/Romulus/V1/CallDescriptions.ts)** - Call resource operations and fields
- **[AgentsDescriptions.ts](nodes/Romulus/V1/AgentsDescriptions.ts)** - Agent resource operations and fields
- **[MessengerDescriptions.ts](nodes/Romulus/V1/MessengerDescriptions.ts)** - Messenger resource operations and fields

These are imported and spread into the main node's `properties` array in RomulusV1.node.ts.

### API Communication

**[GenericFunctions.ts](nodes/Romulus/V1/GenericFunctions.ts)** contains the `romulusApiRequest` function:
- Base URL: `https://api.romulus.live/v1`
- Uses n8n's `requestWithAuthentication` helper
- Supports query parameters and request body
- Authentication via API key in `Authorization` header

### Credentials

**[RomulusApi.credentials.ts](credentials/RomulusApi.credentials.ts)**:
- API key authentication only
- Credential test endpoint: `GET /me`
- API key format: Raw token in Authorization header

## Adding New Operations

When adding a new operation to an existing resource:

1. Add the operation option to the appropriate `*Operations` array in `*Descriptions.ts`
2. Add required field definitions to the `*Fields` array in the same file
3. Add the operation handler logic in [RomulusV1.node.ts](nodes/Romulus/V1/RomulusV1.node.ts) `execute()` method under the appropriate resource block

Example structure:
```typescript
// In AgentsDescriptions.ts
export const agentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    options: [
      { name: 'New Operation', value: 'newOperation', action: 'New operation' }
    ]
  }
];

export const agentFields: INodeProperties[] = [
  {
    displayName: 'Field Name',
    name: 'fieldName',
    displayOptions: { show: { resource: ['agent'], operation: ['newOperation'] } }
  }
];

// In RomulusV1.node.ts execute() method
if (resource === 'agent') {
  if (operation === 'newOperation') {
    const endpoint = '/ai-agents/...';
    responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
  }
}
```

**Important patterns to follow**:
- Use `displayOptions.show` to conditionally display fields based on resource and operation
- Field names should match the API parameter names (use snake_case for API fields)
- Always use `romulusApiRequest.call(this, method, endpoint, body, queryParams)` for API calls
- The `execute()` method processes items in a loop - handle each input item separately

## Adding a New Resource

1. Create `NewResourceDescriptions.ts` in `nodes/Romulus/V1/`
2. Export `newResourceOperations` and `newResourceFields` arrays
3. Import and spread them in [RomulusV1.node.ts](nodes/Romulus/V1/RomulusV1.node.ts) properties
4. Add resource option to the main resource dropdown
5. Add resource handler block in `execute()` method

## Webhook Trigger Considerations

The trigger node handles two different API patterns:
- **Robocalls** use `/call-tasks/webhook-subscriptions` endpoint
- **Agent events** (`AGENT_CALL_COMPLETED`, `AGENT_ACTION_COMPLETED`) use `/webhook-subscriptions` endpoint

When checking for existing webhooks or deleting them, the node searches both endpoints because the webhook URL is the same but the storage location differs based on event type.

**Webhook lifecycle methods** (`webhookMethods.default`):
- `checkExists()` - Searches both endpoints to see if webhook already exists (by URL match)
- `create()` - Creates webhook at appropriate endpoint based on event type
- `delete()` - Searches both endpoints and deletes matching webhook by ID

The response format varies between endpoints - the code handles arrays, paginated responses (`content`), and older format (`results`).

## Build Output

- TypeScript compiles to `dist/` directory
- Icons (PNG/SVG) are copied from `nodes/` and `credentials/` to `dist/` via Gulp
- Only `dist/` folder is included in npm package (see `package.json` files array)
- n8n loads nodes from paths specified in `package.json` under `n8n.nodes` and `n8n.credentials`

## API Version

Currently implements Romulus API v1. The base URL is hardcoded in GenericFunctions.ts. If adding v2 support:
- Create new `V2/` directory with updated implementation
- Update version wrapper in Romulus.node.ts to include version 2
- Consider whether to make API version a user-selectable parameter

## Development Workflow

When working on this codebase:

1. **Testing locally**: Install the package in a local n8n instance by linking:
   ```bash
   npm run build
   cd ~/.n8n/custom-nodes  # or your n8n custom nodes directory
   npm link /path/to/n8n-nodes-romulus
   ```

2. **After making changes**: Always run `npm run build` before testing, as n8n loads from the `dist/` folder

3. **Node versioning**: If you need to create a breaking change, increment the node version:
   - Create a new `V2/` directory with the updated implementation
   - Update the version wrapper in `Romulus.node.ts` to include the new version
   - Keep V1 for backward compatibility with existing workflows

## Current Resources and Operations

**Call Resource**:
- `listRobocalls` - GET `/call-tasks/robocalls/configurations` (paginated)
- `startRobocall` - POST `/call-tasks/robocalls`

**Agent Resource**:
- `listAllAgents` - GET `/ai-agents/agents/search` (paginated)
- `listAllAgentCallTasks` - GET `/ai-agents/agents/{agentId}/call-tasks` (paginated)
- `startAgentCall` - POST `/ai-agents/agents/{agentId}/call` (immediate call without scheduling)
- `startAgentCallTask` - POST `/ai-agents/agents/{agentId}/call-tasks` (scheduled call with retry logic)

**Messenger Resource**:
- `listAllWhatsappBots` - GET `/messengers/whatsapp/bots` (paginated)
- `sendWhatsappTemplateMessage` - POST `/messengers/whatsapp/template-message`

**Trigger Events**:
- `robocall` - Robocall started/answered
- `AGENT_CALL_COMPLETED` - Agent call finished
- `AGENT_ACTION_COMPLETED` - Specific agent action completed
