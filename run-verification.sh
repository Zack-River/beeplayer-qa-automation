#!/bin/bash
set -e
echo "Starting local verification..."
cd docker
echo "[1] Building Docker Compose..."
docker compose -f docker-compose.staging.yml build
echo "[2] Booting containers..."
docker compose -f docker-compose.staging.yml up -d
echo "[3] Waiting for healthcheck (up to 60s)..."
timeout 60s bash -c 'until [ "$(docker inspect -f {{.State.Health.Status}} beeplayer-staging-api)" == "healthy" ]; do sleep 2; done'
if [ "$(docker inspect -f {{.State.Health.Status}} beeplayer-staging-api)" != "healthy" ]; then
  echo "Failed to become healthy. Logs:"
  docker compose -f docker-compose.staging.yml logs
  exit 1
fi
echo "[4] Running Playwright E2E tests against ephemeral staging..."
cd ..
BASE_URL=http://localhost:4301 npx playwright test --project=api
echo "[5] Tearing down containers..."
cd docker
docker compose -f docker-compose.staging.yml down -v
echo "Verification complete!"
