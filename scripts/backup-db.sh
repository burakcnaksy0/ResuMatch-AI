#!/bin/bash
# ─────────────────────────────────────────────────────────────
# ResuMatch AI — PostgreSQL Backup Script
# Usage: ./scripts/backup-db.sh
# Auto-run: added to package.json as "db:backup"
# ─────────────────────────────────────────────────────────────

set -e

# Config — matches backend/.env DATABASE_URL
DB_HOST="localhost"
DB_PORT="5555"
DB_NAME="resumatch_dev"
DB_USER="postgres"
PGPASSWORD="password"

# Backup dir (inside project, gitignored)
BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"

# Timestamped filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "📦 Backing up '$DB_NAME' → $(basename $BACKUP_FILE)"

# Run pg_dump and compress
PGPASSWORD="$PGPASSWORD" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-password \
  | gzip > "$BACKUP_FILE"

echo "✅ Backup saved: $BACKUP_FILE"

# Keep only the last 10 backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 10 ]; then
  ls -1t "$BACKUP_DIR"/*.sql.gz | tail -n +11 | xargs rm -f
  echo "🗑  Old backups cleaned (kept last 10)"
fi
