# =================================
#           FIRST BASE
# =================================
FROM node:20-slim AS base
# Adds pnpm dependency
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y postgresql-client procps
# Create a user 'app'
RUN useradd -ms  /bin/sh -u 1001 app
USER app
# Copy the application in the image
COPY --chown=app:app . /app
WORKDIR /app

# =================================
#              BUILD
# =================================
FROM base AS build
RUN pnpm install
# Supprime le dossier des migrations si présent
RUN rm -rf prisma/migrations
RUN pnpx prisma generate
#RUN pnpm run build

# =================================
#            FINAL BASE
# =================================
FROM base
COPY --chown=app:app --from=build /app/node_modules /app/node_modules
#COPY --chown=app:app --from=build /app/dist /app/dist
COPY --chown=app:app entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENV API_PORT=3000
EXPOSE $API_PORT
ENTRYPOINT ["/app/entrypoint.sh"]