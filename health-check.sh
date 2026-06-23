#!/bin/bash

# ResuMatchAI - System Health Check Script
# This script verifies all components are running correctly

echo "🔍 ResuMatchAI System Health Check"
echo "==================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_service() {
    local name=$1
    local url=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -qE "200|404|401"; then
        echo -e "${GREEN}✓${NC} $name is running"
        return 0
    else
        echo -e "${RED}✗${NC} $name is NOT running"
        return 1
    fi
}

# 1. Check Docker Services
echo "📦 Infrastructure Services:"
echo "----------------------------"

if docker compose ps | grep -q "resumatch_postgres"; then
    echo -e "${GREEN}✓${NC} PostgreSQL container is running"
else
    echo -e "${RED}✗${NC} PostgreSQL container is NOT running"
fi

if docker compose ps | grep -q "resumatch_redis"; then
    echo -e "${GREEN}✓${NC} Redis container is running"
else
    echo -e "${RED}✗${NC} Redis container is NOT running"
fi

echo ""

# 2. Check Backend API
echo "🚀 Backend API:"
echo "----------------------------"
if check_service "Backend API" "http://localhost:3001/api/v1"; then
    echo -e "${GREEN}✓${NC} Backend is accessible at http://localhost:3001"
else
    echo -e "${RED}✗${NC} Backend is NOT accessible"
fi

echo ""

# 3. Check Frontend
echo "🎨 Frontend Application:"
echo "----------------------------"
if check_service "Frontend" "http://localhost:3000"; then
    echo -e "${GREEN}✓${NC} Frontend is accessible at http://localhost:3000"
else
    echo -e "${RED}✗${NC} Frontend is NOT accessible"
fi

echo ""

# 4. Check Database Connection
echo "💾 Database Connection:"
echo "----------------------------"
if command -v psql &> /dev/null; then
    if PGPASSWORD=password psql -h localhost -p 5555 -U postgres -d resumatch_dev -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Database connection successful"
    else
        echo -e "${RED}✗${NC} Cannot connect to database"
    fi
else
    echo -e "${YELLOW}⚠${NC} psql not installed, skipping database check"
fi

echo ""

# 5. Check Redis Connection
echo "🗄️  Redis Connection:"
echo "----------------------------"
if command -v redis-cli &> /dev/null; then
    if redis-cli -h localhost -p 6379 ping | grep -q "PONG"; then
        echo -e "${GREEN}✓${NC} Redis connection successful"
    else
        echo -e "${RED}✗${NC} Cannot connect to Redis"
    fi
else
    echo -e "${YELLOW}⚠${NC} redis-cli not installed, skipping Redis check"
fi

echo ""

# 6. Check Port Availability
echo "🔌 Port Status:"
echo "----------------------------"
for port in 3000 3001 5555 6379 8801; do
    if lsof -i :$port &> /dev/null; then
        echo -e "${GREEN}✓${NC} Port $port is in use"
    else
        echo -e "${YELLOW}⚠${NC} Port $port is NOT in use"
    fi
done

echo ""

# 7. Environment Variables Check
echo "⚙️  Configuration:"
echo "----------------------------"
if [ -f backend/.env ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
    
    # Check critical variables
    if grep -q "DATABASE_URL=" backend/.env; then
        echo -e "${GREEN}✓${NC} DATABASE_URL is configured"
    else
        echo -e "${RED}✗${NC} DATABASE_URL is missing"
    fi
    
    if grep -q "REDIS_PORT=6379" backend/.env; then
        echo -e "${GREEN}✓${NC} REDIS_PORT is correct (6379)"
    else
        echo -e "${RED}✗${NC} REDIS_PORT may be incorrect"
    fi
else
    echo -e "${RED}✗${NC} Backend .env file NOT found"
fi

if [ -f frontend/.env.local ]; then
    echo -e "${GREEN}✓${NC} Frontend .env.local file exists"
else
    echo -e "${YELLOW}⚠${NC} Frontend .env.local not found (using defaults)"
fi

echo ""
echo "==================================="
echo "Health check complete!"
echo ""

# Show useful commands
echo "💡 Useful Commands:"
echo "----------------------------"
echo "View backend logs:  docker compose logs -f"
echo "View database GUI:  npx prisma studio (from backend/)"
echo "View Redis UI:      http://localhost:8801"
echo "Restart services:   docker compose restart"
echo ""
