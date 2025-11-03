# Testing Guide for n8n-nodes-romulus

This guide explains how to test your Romulus node locally using Docker.

## Quick Start (First Time)

1. **Make sure Docker is installed and running**
   - Download Docker Desktop: https://docs.docker.com/get-docker/
   - Start Docker Desktop

2. **Run the test environment**
   ```bash
   ./test-n8n.sh
   ```

3. **Open your browser**
   - Go to: http://localhost:5678
   - Create an account (it's local, use any credentials)
   - Start creating workflows with your Romulus node!

## Making Changes to the Node

After you edit any code in the node:

```bash
# Quick rebuild and restart
./rebuild.sh
```

Then refresh your browser (Cmd/Ctrl + Shift + R).

## Useful Commands

### View n8n logs
```bash
docker-compose logs -f
```

### Stop n8n
```bash
docker-compose down
```

### Restart n8n
```bash
docker-compose restart
```

### Complete rebuild (if something breaks)
```bash
docker-compose down
./test-n8n.sh
```

### Clean everything (including workflows and credentials)
```bash
docker-compose down -v
./test-n8n.sh
```

## Testing Checklist

### Test New Campaign Resource

1. Add a Romulus node to your workflow
2. Select Resource: **Campaign**
3. Test **Create Call Tasks**:
   - Enter a Campaign ID
   - Select Import Source (API, MANUAL, or FILE)
   - Add recipients in JSON format:
     ```json
     [
       {
         "contact_phone_number": "+1234567890",
         "contact_name": "John Doe",
         "contact_email": "john@example.com"
       }
     ]
     ```
   - Optionally add retry/availability configurations
   - Execute and verify response

4. Test **Terminate Call Tasks**:
   - Enter Campaign ID
   - Enter phone number to terminate
   - Execute and verify

### Test New Webhook Resource

1. Select Resource: **Webhook**
2. Test **List** operation:
   - Set page and size parameters
   - Execute to see existing webhooks

3. Test **Create** operation:
   - Choose event type (AGENT_CALL_COMPLETED or AGENT_ACTION_COMPLETED)
   - Enter webhook URL
   - Optionally add entity type, entity ID, retry settings
   - Execute and save the returned webhook ID

4. Test **Get** operation:
   - Use the webhook ID from create
   - Execute to retrieve webhook details

5. Test **Update** operation:
   - Use webhook ID
   - Change status (ACTIVE/INACTIVE)
   - Optionally update other fields
   - Execute to verify update

6. Test **Delete** operation:
   - Use webhook ID
   - Execute to delete webhook

### Test Enhanced Call Resource

1. Select Resource: **Call**
2. Test the new webhook operations:
   - **Create Webhook Subscription**
   - **List Webhook Subscriptions**
   - **Delete Webhook Subscription**

### Test Enhanced Agent Resource

1. Select Resource: **Agent**
2. Test **Terminate Call Task by ID**:
   - Enter a valid call task ID
   - Execute to terminate

3. Test **Terminate Call Tasks by Phone**:
   - Enter phone number in E164 format
   - Execute to terminate all tasks for that number

## Troubleshooting

### "Cannot connect to Docker"
- Make sure Docker Desktop is running
- Try restarting Docker

### "Port 5678 already in use"
- Stop any other n8n instances
- Or change the port in `docker-compose.yml`:
  ```yaml
  ports:
    - "5679:5678"  # Use port 5679 instead
  ```

### "Changes not showing up"
- Make sure you ran `./rebuild.sh`
- Hard refresh browser (Cmd/Ctrl + Shift + R)
- Check Docker logs: `docker-compose logs -f`

### "Build failed"
- Check for TypeScript errors in the output
- Make sure all dependencies are installed: `npm install --cache /tmp/.npm-cache`
- Check that all imports are correct

### "Node not appearing in n8n"
- Check Docker logs: `docker-compose logs -f`
- Look for errors about loading custom nodes
- Try a complete rebuild: `docker-compose down && ./test-n8n.sh`

## Tips

- **Keep logs open**: In a separate terminal, run `docker-compose logs -f` to see real-time logs
- **Test with real API**: Use your actual Romulus API credentials for realistic testing
- **Create test workflows**: Save different workflows for testing each resource
- **Check responses**: Examine the JSON output from each operation to ensure it matches API documentation

## What Gets Persisted

- ✅ **Workflows**: Saved in Docker volume, survive container restarts
- ✅ **Credentials**: Saved in Docker volume, survive container restarts
- ❌ **Code changes**: Need to rebuild (`./rebuild.sh`) to see changes

## Cleaning Up

When you're done testing:

```bash
# Stop container but keep workflows/credentials
docker-compose down

# Stop and delete everything (workflows, credentials, volumes)
docker-compose down -v

# Remove Docker image
docker-compose down --rmi all -v
```
