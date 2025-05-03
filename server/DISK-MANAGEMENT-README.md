# Disk Space Management for Explorer Server

This document provides guidance on managing disk space for the Explorer server, focusing on Docker log rotation and cleanup strategies.

## Quick Start

For immediate disk space relief:

```bash
# Run on the server
sudo ./disk-cleanup.sh
```

For long-term log management:

```bash
# Set up log rotation and scheduled cleanup
sudo ./setup-log-rotation.sh
```

## Available Scripts

1. **docker-cleanup.sh**
   - Cleans up Docker resources and logs
   - Can be run manually or via cron
   - Keeps logs for no more than 7 days

2. **disk-cleanup.sh**
   - Comprehensive disk cleanup (Docker + system)
   - Should be run with sudo
   - More aggressive than docker-cleanup.sh

3. **setup-log-rotation.sh**
   - Sets up system-wide Docker log rotation
   - Installs cleanup scripts
   - Configures weekly cron job

## Docker Compose Log Configuration

The `docker-compose.yml` has been updated to include log rotation for each service:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
    compress: "true"
```

This limits each container's logs to 30MB total (3 files × 10MB) and compresses older logs.

## System-wide Docker Log Configuration

The setup script creates `/etc/docker/daemon.json` with log rotation settings:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "compress": "true"
  }
}
```

## Monitoring Disk Usage

To monitor disk usage:

```bash
# Overall disk usage
df -h

# Docker disk usage
docker system df

# Detailed Docker disk usage
docker system df -v

# Find large files
sudo find / -type f -size +100M -exec ls -lh {} \; | sort -k5 -h
```

## Schedule Regular Cleanup

By default, the setup script configures a weekly cleanup job. To change this:

```bash
# Edit the root crontab
sudo crontab -e
```

Example cron configurations:

1. **Weekly cleanup** (Sunday at 1 AM):
   ```
   0 1 * * 0 /usr/local/bin/docker-cleanup.sh >> /var/log/docker-cleanup.log 2>&1
   ```

2. **Daily cleanup** (at 2 AM):
   ```
   0 2 * * * /usr/local/bin/docker-cleanup.sh >> /var/log/docker-cleanup.log 2>&1
   ```

3. **Monthly comprehensive cleanup** (1st day at 3 AM):
   ```
   0 3 1 * * /path/to/disk-cleanup.sh >> /var/log/disk-cleanup.log 2>&1
   ```

## Applying Changes

After modifying Docker log settings:

1. Restart Docker daemon:
   ```bash
   sudo systemctl restart docker
   ```

2. Restart containers:
   ```bash
   cd /path/to/explorer/server
   docker-compose down
   docker-compose up -d
   ```

## Best Practices

1. **Regular Monitoring**: Check disk usage weekly
2. **Retention Policy**: Review log retention needs; 7 days is recommended
3. **Application Logs**: Consider redirecting application logs to files and rotate them
4. **Backup**: Back up important data before running cleanup scripts
5. **Test First**: Test cleanup scripts in non-production environment 