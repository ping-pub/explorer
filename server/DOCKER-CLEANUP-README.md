# Docker Log Cleanup

This document explains how to set up regular Docker log cleanup to prevent disk space issues.

## Log Rotation in Docker Compose

The `docker-compose.yml` file includes log rotation settings for each service:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
    compress: "true"
```

These settings:
- Limit log files to 10MB each
- Keep only 3 rotated log files
- Compress older log files

## Docker System-wide Settings

For Docker daemon system-wide settings, create or modify `/etc/docker/daemon.json`:

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

After modifying this file, restart Docker:

```bash
sudo systemctl restart docker
```

## Cleanup Script

The `docker-cleanup.sh` script provides additional cleanup by:
1. Pruning unused Docker resources
2. Removing exited containers
3. Truncating active container logs
4. Cleaning up log files older than 7 days

### Setting up Automated Cleanup

To run the cleanup script weekly, add a cron job:

1. Edit the crontab:
   ```bash
   sudo crontab -e
   ```

2. Add the following line to run the script every Sunday at 1 AM:
   ```
   0 1 * * 0 /absolute/path/to/explorer/server/docker-cleanup.sh >> /var/log/docker-cleanup.log 2>&1
   ```

3. Save and exit.

### Manual Run

To run the cleanup script manually:

```bash
sudo ./docker-cleanup.sh
```

## Important Notes

- Docker logs are stored in `/var/lib/docker/containers/` on Linux systems
- The cleanup script assumes access to this location
- For Kubernetes environments, consider using a different approach
- Always test the script in a non-production environment first 