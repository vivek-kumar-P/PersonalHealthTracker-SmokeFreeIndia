#!/bin/bash

# SmokeFree India - Test Runner Script
# Usage: ./run-tests.sh [test-type]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SmokeFree India - Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if servers are running
check_servers() {
    echo -e "${YELLOW}Checking if servers are running...${NC}"
    
    # Check backend
    if curl -s http://localhost:5000/api/states > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend server is running${NC}"
    else
        echo -e "${RED}✗ Backend server not running. Start with: npm run server${NC}"
        exit 1
    fi
    
    # Check frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend server is running${NC}"
    else
        echo -e "${YELLOW}! Frontend server may not be running. Some E2E tests may fail.${NC}"
    fi
}

# Install test dependencies
install_deps() {
    echo -e "${YELLOW}Installing test dependencies...${NC}"
    cd tests
    npm install
    cd ..
}

# Run API tests
run_api_tests() {
    echo -e "${BLUE}Running API Tests...${NC}"
    cd tests
    npm run test:api
    cd ..
}

# Run E2E tests
run_e2e_tests() {
    echo -e "${BLUE}Running E2E Tests...${NC}"
    cd tests
    npm run test:e2e
    cd ..
}

# Run all tests
run_all_tests() {
    echo -e "${BLUE}Running All Tests...${NC}"
    cd tests
    npm test
    cd ..
}

# Main execution
case "${1:-all}" in
    "api")
        check_servers
        run_api_tests
        ;;
    "e2e")
        check_servers
        run_e2e_tests
        ;;
    "install")
        install_deps
        ;;
    "all"|*)
        check_servers
        run_all_tests
        ;;
esac

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Tests Completed!${NC}"
echo -e "${GREEN}========================================${NC}"
