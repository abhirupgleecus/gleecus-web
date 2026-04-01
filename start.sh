#!/bin/sh

echo "Waiting for DB..."

# Retry migrations until success
while ! alembic upgrade head
do
  echo "Migration failed, retrying in 2 seconds..."
  sleep 2
done

echo "Migrations successful"

# Run seed
python -m app.seed

echo "Starting app..."

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000