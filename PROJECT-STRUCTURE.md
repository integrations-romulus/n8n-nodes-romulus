# Project Structure

This document explains the organization of the n8n-nodes-romulus project.

## Directory Layout

```
n8n-nodes-romulus/
├── 📁 nodes/              # Source TypeScript files for nodes
│   └── Romulus/
│       ├── V1/            # Version 1 implementation
│       │   ├── RomulusV1.node.ts
│       │   ├── AgentsDescriptions.ts
│       │   ├── CallDescriptions.ts
│       │   ├── CampaignDescriptions.ts
│       │   ├── MessengerDescriptions.ts
│       │   ├── WebhookDescriptions.ts
│       │   └── GenericFunctions.ts
│       ├── Romulus.node.ts        # Version wrapper
│       └── RomulusTrigger.node.ts
│
├── 📁 credentials/        # API credential definitions
│   └── RomulusApi.credentials.ts
│
├── 📁 dist/              # Compiled output (generated, not in git)
│   ├── nodes/            # Only this folder is published to npm
│   └── credentials/
│
├── 📦 Docker & Testing   # Development/testing files (not published)
│   ├── docker-compose.yml
│   ├── Dockerfile.test
│   ├── test-n8n.sh       # Start n8n with your node
│   ├── rebuild.sh        # Rebuild after code changes
│   ├── GET-STARTED.md    # Quick start guide
│   ├── TESTING.md        # Detailed testing guide
│   └── README-TESTING.md # Quick reference
│
├── 📝 Configuration
│   ├── package.json      # Node metadata & dependencies
│   ├── tsconfig.json     # TypeScript compiler config
│   ├── gulpfile.js       # Build task for copying icons
│   ├── .eslintrc.js      # Linting rules
│   └── .prettierrc.js    # Code formatting rules
│
└── 📄 Documentation
    ├── README.md         # Main documentation
    ├── CLAUDE.md         # AI assistant instructions
    └── LICENSE.md
```

## What Gets Published to npm?

Only the **`dist/`** folder is published, as defined in `package.json`:

```json
"files": ["dist"]
```

This means:
- ✅ **Published:** Compiled JavaScript in `dist/`
- ❌ **Not published:** Source TypeScript, Docker files, test scripts, dev docs

## Development Files (Not Published)

These files are **only for local development** and won't appear in the npm package:

### Testing & Docker
- `docker-compose.yml` - Docker setup for local testing
- `Dockerfile.test` - Custom Docker image for development
- `test-n8n.sh` - Automated setup script
- `rebuild.sh` - Quick rebuild script
- `*-TESTING.md` - Testing documentation

### Source Code
- `nodes/**/*.ts` - TypeScript source (only `dist/` is published)
- `credentials/**/*.ts` - TypeScript source

### Development Tools
- `.eslintrc*.js` - Linting configuration
- `.prettierrc.js` - Code formatting
- `gulpfile.js` - Build scripts
- `tsconfig.json` - TypeScript config

### Documentation (Development)
- `CLAUDE.md` - AI assistant instructions
- `GET-STARTED.md` - Local testing guide
- `PROJECT-STRUCTURE.md` - This file

## Why This Structure?

### ✅ Advantages

1. **Clean npm package** - Only compiled code is published
2. **Easy development** - Testing tools are immediately visible
3. **Standard conventions** - Docker Compose in root is industry standard
4. **No confusion** - `.npmignore` and `files` field ensure safety
5. **Git-friendly** - All dev files are tracked for collaboration

### 📊 Comparison with Alternatives

**Alternative: Move testing files to `/dev` or `/scripts`**

Pros:
- Slightly cleaner root directory
- Clear visual separation

Cons:
- Breaks Docker Compose convention (expects root location)
- Requires path updates in all scripts
- Less discoverable for new contributors
- No practical benefit (files aren't published anyway)

**Verdict:** Current structure is optimal ✅

## File Categories

### 🚀 Production (Published to npm)
- `dist/` - Compiled JavaScript + declarations
- `package.json` - Package metadata
- `README.md` - User documentation
- `LICENSE.md` - License terms

### 🔧 Development (Git only)
- Source TypeScript files (`nodes/`, `credentials/`)
- Build configuration (`tsconfig.json`, `gulpfile.js`)
- Code quality tools (`.eslintrc.js`, `.prettierrc.js`)

### 🧪 Testing (Git only)
- Docker setup (`docker-compose.yml`, `Dockerfile.test`)
- Test scripts (`*.sh`)
- Test documentation (`*-TESTING.md`, `GET-STARTED.md`)

### 📚 Documentation
- `README.md` - Published with package (user-facing)
- `CLAUDE.md` - Development only (AI context)
- `TESTING.md` - Development only (testing guide)
- `PROJECT-STRUCTURE.md` - Development only (this file)

## Verification

To verify what gets published, run:

```bash
# See what files would be published
npm pack --dry-run

# Or create actual tarball to inspect
npm pack
tar -tzf n8n-nodes-romulus-*.tgz
```

You'll see only `dist/` contents are included.

## Best Practices

1. **Keep Docker files in root** - Standard convention
2. **Use descriptive names** - `test-n8n.sh` is clear
3. **Prefix test docs** - `TESTING.md`, `GET-STARTED.md` are obviously dev docs
4. **Trust npm `files` field** - It's the authoritative source for what gets published
5. **Don't over-organize** - Moving files to subdirs without benefit adds complexity

## Adding New Files

### Source Code
- Add to `nodes/` or `credentials/`
- Import in appropriate files
- Rebuild to see in `dist/`

### Testing Scripts
- Add to root directory
- Make executable: `chmod +x script.sh`
- Document in `TESTING.md`

### Documentation
- User docs → `README.md` (gets published)
- Dev docs → `*-TESTING.md` or similar (not published)

## Questions?

- **"Won't testing files clutter npm?"** - No, `files: ["dist"]` excludes everything else
- **"Should I move Docker files?"** - No, root location is standard
- **"Can users see test scripts?"** - Only if they clone the repo, not from npm install
- **"Is this structure standard?"** - Yes, very common in n8n community nodes

## Summary

✅ **Current structure is optimal**
- Testing files stay in root (industry standard)
- Only `dist/` is published (controlled by package.json)
- Clear naming makes purpose obvious
- Easy to discover and use
- Follows Docker and npm conventions
