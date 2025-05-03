#!/bin/bash

# Comprehensive disk cleanup script for Docker environments
# Run this script with sudo to clean up disk space

echo "Starting comprehensive disk cleanup - $(date)"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# 1. Docker cleanup
echo "Cleaning up Docker resources..."

# Stop unused containers (optional - uncomment if needed)
# docker ps -q -f status=exited | xargs -r docker rm

# Remove unused Docker images, containers, networks, and volumes
echo "Pruning Docker system..."
docker system prune -af --volumes

# Remove all build cache
echo "Removing Docker build cache..."
docker builder prune -af

# Clean up Docker container logs directly
echo "Cleaning up container logs..."
CONTAINERS=$(docker ps -q)
for CONTAINER in $CONTAINERS; do
  CONTAINER_NAME=$(docker inspect --format '{{.Name}}' $CONTAINER | sed 's/\///')
  LOG_PATH=$(docker inspect --format='{{.LogPath}}' $CONTAINER)
  
  if [ -f "$LOG_PATH" ]; then
    echo "Truncating logs for container: $CONTAINER_NAME"
    truncate -s 0 "$LOG_PATH" || echo "Failed to truncate $LOG_PATH"
  fi
done

# Clean up Docker log files older than 7 days
echo "Removing Docker log files older than 7 days..."
find /var/lib/docker/containers/ -name "*.log" -type f -mtime +7 -delete 2>/dev/null || echo "No old Docker log files found or permission denied"

# 2. System cleanup
echo "Cleaning up system files..."

# Clear apt cache if exists
if command -v apt-get &> /dev/null; then
  echo "Cleaning apt cache..."
  apt-get clean
  apt-get autoremove -y
fi

# Clear journal logs
if command -v journalctl &> /dev/null; then
  echo "Cleaning journal logs..."
  journalctl --vacuum-time=7d
fi

# Clean temp files
echo "Cleaning temp files..."
rm -rf /tmp/* /var/tmp/* 2>/dev/null || echo "Some temp files could not be removed"

# Clean old log files
echo "Cleaning old log files..."
find /var/log -type f -name "*.gz" -mtime +7 -delete 2>/dev/null
find /var/log -type f -name "*.old" -mtime +7 -delete 2>/dev/null
find /var/log -type f -name "*.log.*" -mtime +7 -delete 2>/dev/null

# Rotate and truncate logs
if command -v logrotate &> /dev/null; then
  echo "Forcing log rotation..."
  logrotate -f /etc/logrotate.conf
fi

# 3. Report disk usage
echo "Disk usage after cleanup:"
df -h

echo "Comprehensive disk cleanup completed - $(date)" 