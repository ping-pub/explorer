#!/bin/bash

# Script to reset Redis data and remove stale configuration
echo "WARNING: This script will delete all Redis data. Press Ctrl+C to cancel or Enter to continue."
read

# Stop containers
echo "Stopping containers..."
docker-compose down

# Remove Redis data volume
echo "Removing Redis data volume..."
docker volume rm explorer_server_redis-data

# Create fresh Redis data volume
echo "Creating fresh Redis data volume..."
docker volume create explorer_server_redis-data

# Start containers
echo "Starting containers..."
docker-compose up -d

# Wait for Redis to start
echo "Waiting for Redis to start..."
sleep 10

# Check Redis status
echo "Checking Redis status..."
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD:-changeme} ping

echo "Redis reset complete. Check logs for any errors:"
echo "docker-compose logs redis" 