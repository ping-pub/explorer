#!/bin/bash

# Setup script for Docker log rotation
# Run this on the server to set up log rotation

# Exit on any error
set -e

echo "Setting up Docker log rotation..."

# Step 1: Create daemon.json for Docker
echo "Creating system-wide Docker log configuration..."
DAEMON_CONFIG='{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "compress": "true"
  }
}'

# Check if we have sudo access
if command -v sudo &> /dev/null; then
  echo "$DAEMON_CONFIG" | sudo tee /etc/docker/daemon.json > /dev/null
  echo "Docker daemon configuration created at /etc/docker/daemon.json"
  echo "You'll need to restart Docker for these changes to take effect:"
  echo "  sudo systemctl restart docker"
else
  echo "No sudo access detected. Please manually create /etc/docker/daemon.json with the following content:"
  echo "$DAEMON_CONFIG"
fi

# Step 2: Copy cleanup script to appropriate location
echo "Installing Docker cleanup script..."
CLEANUP_SCRIPT_PATH="/usr/local/bin/docker-cleanup.sh"

if command -v sudo &> /dev/null; then
  sudo cp docker-cleanup.sh $CLEANUP_SCRIPT_PATH
  sudo chmod +x $CLEANUP_SCRIPT_PATH
  echo "Cleanup script installed to $CLEANUP_SCRIPT_PATH"
else
  echo "No sudo access detected. Please manually copy docker-cleanup.sh to a suitable location"
  echo "and make it executable with: chmod +x docker-cleanup.sh"
fi

# Step 3: Set up cron job for weekly cleanup
echo "Setting up weekly cron job for Docker cleanup..."
CRON_JOB="0 1 * * 0 $CLEANUP_SCRIPT_PATH >> /var/log/docker-cleanup.log 2>&1"

if command -v sudo &> /dev/null; then
  # Check if crontab exists for root
  if sudo crontab -l &> /dev/null; then
    # Append to existing crontab
    (sudo crontab -l; echo "$CRON_JOB") | sudo crontab -
  else
    # Create new crontab
    echo "$CRON_JOB" | sudo crontab -
  fi
  echo "Cron job set up to run every Sunday at 1 AM"
else
  echo "No sudo access detected. Please manually add the following cron job:"
  echo "$CRON_JOB"
  echo "You can do this by running: sudo crontab -e"
fi

# Step 4: Verify docker-compose.yml has logging configuration
echo "Checking docker-compose.yml for logging configuration..."
if grep -q "logging:" docker-compose.yml; then
  echo "Logging configuration already exists in docker-compose.yml"
else
  echo "WARNING: No logging configuration found in docker-compose.yml"
  echo "Please ensure you've added the logging configuration to each service in docker-compose.yml"
fi

echo "Log rotation setup completed!"
echo "Run 'docker-compose down && docker-compose up -d' to apply changes to running containers"
echo "Note: You may need to restart Docker for system-wide changes to take effect" 