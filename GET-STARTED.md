# 🎯 Get Started: Testing Your Romulus Node

## Step 1: Install Docker (One Time Setup)

### For Mac:
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Open the downloaded `.dmg` file
3. Drag Docker to Applications
4. Open Docker Desktop from Applications
5. Wait for Docker to start (you'll see a whale icon in your menu bar)

### For Windows:
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Run the installer
3. Follow the installation wizard
4. Restart if prompted
5. Launch Docker Desktop

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Verify Docker is Running:
```bash
docker --version
docker-compose --version
```

You should see version numbers for both commands.

---

## Step 2: Start n8n with Your Custom Node

Once Docker is installed and running, simply run:

```bash
./test-n8n.sh
```

This script will:
1. ✅ Check Docker is running
2. ✅ Build your Romulus node package
3. ✅ Start n8n in a Docker container
4. ✅ Load your custom node automatically
5. ✅ Show you the URL and credentials

**Expected output:**
```
========================================
  ✓ Docker is installed
  ✓ Docker is running
  ✓ Build completed successfully
  ✓ Docker container started
  ✓ n8n is ready!

  🚀 n8n is running!
========================================

  URL:         http://localhost:5678
  Username:    admin
  Password:    supersecret
```

---

## Step 3: Open n8n and Test

1. **Open your browser** → http://localhost:5678

2. **Login:**
   - Username: `admin`
   - Password: `supersecret`

3. **Create a workflow:**
   - Click "+ New workflow"

4. **Add Romulus node:**
   - Click the "+" button
   - Search for "Romulus"
   - Click to add it

5. **Add credentials:**
   - Click on the node
   - Click "Create New Credential"
   - Enter your Romulus API key
   - Click "Test" to verify

6. **Test new features:**
   - Select Resource: **Campaign** (NEW!)
   - Select Resource: **Webhook** (NEW!)
   - Try new Agent operations: Terminate tasks
   - Try new Call operations: Webhook subscriptions

---

## Step 4: Making Code Changes (When Needed)

If you need to modify the node code:

```bash
# Edit your TypeScript files in nodes/Romulus/V1/

# Then rebuild and restart:
./rebuild.sh

# Refresh browser (Cmd/Ctrl + Shift + R)
```

---

## Common Commands

```bash
# Start n8n (first time or after stopping)
./test-n8n.sh

# Rebuild after code changes
./rebuild.sh

# View logs in real-time
docker-compose logs -f

# Stop n8n
docker-compose down

# Restart n8n
docker-compose restart

# Complete reset (deletes workflows!)
docker-compose down -v
./test-n8n.sh
```

---

## What You're Testing

### ✨ New Campaign Resource
- Create bulk call tasks with multiple recipients
- Terminate campaign tasks by phone number

### ✨ New Webhook Resource
- List all webhook subscriptions
- Get specific webhook by ID
- Create new webhook subscriptions
- Update webhook status and configuration
- Delete webhook subscriptions

### ✨ Enhanced Agent Resource
- Terminate specific call task by ID
- Terminate all tasks for a phone number

### ✨ Enhanced Call Resource
- Create webhook subscriptions for robocalls
- List robocall webhook subscriptions
- Delete webhook subscriptions

---

## Troubleshooting

### "Docker not found"
→ Install Docker Desktop first (see Step 1)

### "Docker is not running"
→ Open Docker Desktop application

### "Port 5678 already in use"
→ Stop other n8n instances or change port in docker-compose.yml

### "Changes not showing up"
→ Run `./rebuild.sh` and hard refresh browser (Cmd/Ctrl + Shift + R)

### "Node not appearing"
→ Check logs: `docker-compose logs -f`
→ Try complete restart: `docker-compose down && ./test-n8n.sh`

---

## Files Created for You

- **`test-n8n.sh`** - Main startup script
- **`rebuild.sh`** - Quick rebuild after code changes
- **`docker-compose.yml`** - Docker configuration (already existed, updated)
- **`TESTING.md`** - Detailed testing guide
- **`README-TESTING.md`** - Quick reference

---

## Next Steps After Testing

Once you've verified everything works:

1. **Update package.json version** (e.g., 0.1.1 → 0.2.0)
2. **Update CHANGELOG** with new features
3. **Commit changes** to git
4. **Publish to npm**: `npm publish`
5. **Update production** n8n instances

---

## Questions?

- **Testing guide:** See [TESTING.md](TESTING.md)
- **Quick reference:** See [README-TESTING.md](README-TESTING.md)
- **Docker issues:** Check Docker Desktop is running
- **Build errors:** Check TypeScript compilation output

Happy testing! 🚀
