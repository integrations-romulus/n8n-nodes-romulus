# 🚀 Quick Start: Testing Your Romulus Node with Docker

## One Command Setup

```bash
./test-n8n.sh
```

That's it! This will:
- ✅ Build your node package
- ✅ Start n8n in Docker with your custom node loaded
- ✅ Wait for n8n to be ready
- ✅ Show you the login credentials

## Open n8n

Go to: **http://localhost:5678**

Login with:
- **Username:** admin
- **Password:** supersecret

## Test Your New Features

### 1. Find the Romulus Node
- Create a new workflow
- Click the "+" button
- Search for "Romulus"
- Add the node to your workflow

### 2. Add Your API Credentials
- Click on the Romulus node
- Click "Create New Credential"
- Enter your Romulus API key
- Click "Test" to verify

### 3. Test New Resources

**Campaign Resource (NEW!):**
- Resource: Campaign
- Operations: Create Call Tasks, Terminate Call Tasks

**Webhook Resource (NEW!):**
- Resource: Webhook
- Operations: List, Get, Create, Update, Delete

**Enhanced Agent Resource:**
- New operations: Terminate Call Task by ID, Terminate Call Tasks by Phone

**Enhanced Call Resource:**
- New operations: Create/List/Delete Webhook Subscriptions

## Making Changes

When you edit code:

```bash
./rebuild.sh
```

Then refresh your browser (Cmd/Ctrl + Shift + R)

## Useful Commands

```bash
# View live logs
docker-compose logs -f

# Stop n8n
docker-compose down

# Restart n8n
docker-compose restart

# Start fresh (keeps your workflows)
./test-n8n.sh

# Nuclear option (deletes all workflows and data)
docker-compose down -v
./test-n8n.sh
```

## Need Help?

See [TESTING.md](TESTING.md) for detailed testing instructions and troubleshooting.

## What's Different from Production?

The Docker setup:
- Runs n8n locally on your machine
- Loads your custom node automatically
- Persists workflows and credentials between restarts
- Mounts your `dist/` folder so rebuilds are fast

Perfect for testing before publishing to npm!
