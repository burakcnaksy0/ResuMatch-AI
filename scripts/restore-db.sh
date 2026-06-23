#!/bin/bash
# ─────────────────────────────────────────────────────────────
# ResuMatch AI — PostgreSQL Restore Script
# Usage: ./scripts/restore-db.sh backups/resumatch_dev_YYYYMMDD_HHMMSS.sql.gz
# ─────────────────────────────────────────────────────────────

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Usage: $0 <backup-file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -1t "$(dirname "$0")/../backups/"*.sql.gz 2>/dev/null || echo "  (no backups found)"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ File not found: $BACKUP_FILE"
  exit 1
fi

DB_HOST="localhost"
DB_PORT="5555"
DB_NAME="resumatch_dev"
DB_USER="postgres"
PGPASSWORD="password"

echo "⚠️  This will OVERWRITE the database '$DB_NAME'."
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

echo "🔄 Restoring from: $(basename $BACKUP_FILE)"

# Drop and recreate the DB
PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
  -c "DROP DATABASE IF EXISTS $DB_NAME;" \
  -c "CREATE DATABASE $DB_NAME;"

# Restore
gunzip -c "$BACKUP_FILE" | PGPASSWORD="$PGPASSWORD" psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME"

echo "✅ Restore complete!"
