#!/bin/bash

# Quick rebuild script for when you make changes

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Rebuilding node package...${NC}"
npm run build --cache /tmp/.npm-cache

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build complete"
    echo -e "${BLUE}Restarting n8n container...${NC}"
    docker-compose restart
    echo -e "${GREEN}✓${NC} Container restarted"
    echo ""
    echo -e "${GREEN}Done! Refresh your browser (Cmd/Ctrl + Shift + R)${NC}"
else
    echo -e "${RED}✗${NC} Build failed"
    exit 1
fi
