FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    cd ui && npm install
RUN pnpm run build

EXPOSE 3456

CMD ["node", "dist/cli.js", "start"]
