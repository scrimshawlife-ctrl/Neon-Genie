# Neon Genie - Orin Nano Deployment

This directory contains Docker-based deployment configuration for running Neon Genie on NVIDIA Jetson Orin Nano (or any ARM64/x86_64 system).

## Quick Start

```bash
cd deployment/orin-nano
./deploy.sh
```

The service will be available at: `http://localhost:3000`

## Requirements

- Docker Engine 20.10+
- Docker Compose 2.0+
- 512MB RAM minimum (1GB recommended)
- 1GB disk space

## Architecture

Optimized for ARM64 (aarch64) but works on x86_64 as well.

## Configuration

### Environment Variables

Edit `docker-compose.yml` to customize:

```yaml
environment:
  - NODE_ENV=production
  - MODE=standalone
  - ABRAXAS_ENDPOINT=http://abraxas-api:8080  # When Abraxas is available
  - ABRAXAS_API_KEY=your-key-here
```

### Resource Limits

Default configuration:
- Memory limit: 1GB
- Memory reservation: 512MB

Adjust in `docker-compose.yml` under `deploy.resources`.

### Volumes

Two persistent volumes are created:
- `./data` - Idea corpus storage
- `./logs` - Application logs

## Commands

### Deploy
```bash
./deploy.sh
```

### View logs
```bash
docker-compose logs -f
```

### Stop
```bash
docker-compose down
```

### Restart
```bash
docker-compose restart
```

### Access shell
```bash
docker-compose exec neon-genie sh
```

### Rebuild
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Health Check

The container includes a health check that runs every 30 seconds:
- Endpoint: `http://localhost:3000/health`
- Timeout: 3 seconds
- Start period: 40 seconds

## Troubleshooting

### Container won't start
```bash
docker-compose logs
```

### Check health
```bash
docker-compose ps
```

### Clear data and restart
```bash
docker-compose down -v
rm -rf data logs
./deploy.sh
```

### Resource issues
If running on Orin Nano with limited RAM, reduce memory limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

## Production Recommendations

1. **Use HTTPS**: Set up reverse proxy (nginx/traefik) with SSL
2. **Monitoring**: Add Prometheus + Grafana for metrics
3. **Backups**: Regular backups of `./data` directory
4. **Updates**: Use tagged releases instead of `latest`
5. **Security**: Run as non-root user, use secrets management

## Integration with Abraxas

When Abraxas API becomes available:

1. Update `docker-compose.yml`:
```yaml
environment:
  - ABRAXAS_ENDPOINT=https://abraxas.example.com
  - ABRAXAS_API_KEY=${ABRAXAS_API_KEY}
```

2. Create `.env` file:
```
ABRAXAS_API_KEY=your-actual-key
```

3. Restart:
```bash
docker-compose down
docker-compose up -d
```

## Performance

Expected performance on Jetson Orin Nano:
- Idea generation: ~500ms
- Semantic search: ~100ms (with transformers)
- Memory usage: ~300-500MB
- Storage: ~10MB per 100 ideas

## Support

For issues or questions:
- GitHub: https://github.com/scrimshawlife-ctrl/Neon-Genie
- Documentation: See main README.md
