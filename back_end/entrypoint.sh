#!/bin/sh
set -e


# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT"; do
	echo "PostgreSQL is unavailable - sleeping"
	sleep 2
done
echo "PostgreSQL is up!"

pnpm prisma migrate reset --force
# Run Prisma migrations and generate client
npx prisma migrate dev --name init
npx prisma generate

# Start the API
pnpm run start:dev
