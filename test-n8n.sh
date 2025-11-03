#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  n8n-nodes-romulus Test Environment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

print_status "Docker is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker."
    exit 1
fi

print_status "Docker is running"

# Build the project
echo ""
echo -e "${BLUE}Building the node package...${NC}"
npm run build --cache /tmp/.npm-cache

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix errors and try again."
    exit 1
fi

print_status "Build completed successfully"

# Stop and remove existing container if it exists
echo ""
echo -e "${BLUE}Cleaning up existing containers...${NC}"
docker-compose down 2>/dev/null
print_status "Cleanup complete"

# Start the Docker container
echo ""
echo -e "${BLUE}Starting n8n...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start Docker container"
    exit 1
fi

print_status "Docker container started"

# Wait for n8n to be ready
echo ""
echo -e "${BLUE}Waiting for n8n to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5678 > /dev/null 2>&1; then
        print_status "n8n is ready!"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🚀 n8n is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  ${BLUE}URL:${NC}         http://localhost:5678"
echo -e "  ${BLUE}Username:${NC}    admin"
echo -e "  ${BLUE}Password:${NC}    supersecret"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo -e "  ${BLUE}View logs:${NC}     docker-compose logs -f"
echo -e "  ${BLUE}Stop n8n:${NC}      docker-compose down"
echo -e "  ${BLUE}Restart:${NC}       docker-compose restart"
echo -e "  ${BLUE}Rebuild:${NC}       ./rebuild.sh"
echo ""
echo -e "${YELLOW}After making code changes:${NC}"
echo -e "  1. Run: ${BLUE}./rebuild.sh${NC}"
echo -e "  2. Refresh browser (Cmd/Ctrl + Shift + R)"
echo ""
echo -e "${YELLOW}Testing your Romulus node:${NC}"
echo -e "  1. Open http://localhost:5678 in your browser"
echo -e "  2. Create a new workflow"
echo -e "  3. Search for 'Romulus' node and add it"
echo -e "  4. Test the new resources: Campaign, Webhook"
echo -e "  5. Test new operations in Agent and Call resources"
echo ""
echo -e "${GREEN}========================================${NC}"
