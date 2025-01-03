#!/bin/sh
# wait-for-postgres.sh

set -e

until PGPASSWORD=$POSTGRES_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping // psql -h $DB_HOST -p $DB_PORT -U $POSTGRES_USER -d $POSTGRES_DB "
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"
