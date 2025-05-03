#!/bin/bash

# Script to clean up Docker logs and free disk space
# Recommended to run this weekly via cron

echo "Starting Docker cleanup process - $(date)"

# Step 1: Prune unused Docker resources
echo "Pruning unused Docker resources..."
docker system prune -f

# Step 2: Remove exited containers
echo "Removing exited containers..."
docker ps -a -q --filter "status=exited" | xargs -r docker rm

# Step 3: Find and clean up logs for containers directly
echo "Cleaning up Docker container logs..."
CONTAINERS=$(docker ps -q)
for CONTAINER in $CONTAINERS; do
  CONTAINER_NAME=$(docker inspect --format '{{.Name}}' $CONTAINER | sed 's/\///')
  echo "Truncating logs for container: $CONTAINER_NAME"
  truncate -s 0 $(docker inspect --format='{{.LogPath}}' $CONTAINER) 2>/dev/null || true
done

# Step 4: Clean up old Docker log files from the system
echo "Cleaning up Docker log files older than 7 days..."
find /var/lib/docker/containers/ -name "*.log" -mtime +7 -delete 2>/dev/null || true

echo "Docker cleanup completed - $(date)" 