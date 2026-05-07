# ---- 构建前端 ----
FROM node:20-alpine AS client-builder
WORKDIR /app/web/client
COPY web/client/package*.json ./
RUN npm install
COPY web/client/ ./
RUN npm run build

# ---- 构建后端依赖 ----
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY web/server/package*.json ./
RUN npm install
COPY web/server/ ./

# ---- 最终镜像 ----
FROM node:20-alpine
WORKDIR /app

# 复制后端（含 node_modules）
COPY --from=server-builder /app/server ./server

# 复制构建好的前端静态文件
COPY --from=client-builder /app/web/client/dist ./client/dist

EXPOSE 3000

ENV NODE_ENV=production

WORKDIR /app/server
CMD ["node_modules/.bin/tsx", "index.ts"]
