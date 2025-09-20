
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y postgresql-client
COPY . /app
WORKDIR /app

FROM base AS build
RUN pnpm install
RUN pnpx prisma generate
RUN pnpm run build

FROM base
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENV API_PORT=3000
EXPOSE $API_PORT
ENTRYPOINT ["/app/entrypoint.sh"]