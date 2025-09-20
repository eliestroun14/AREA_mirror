#!/bin/sh
set -e

# Run Prisma migrations and generate client
npx prisma migrate dev --name init
npx prisma generate

# Start the API
pnpm run start:dev
