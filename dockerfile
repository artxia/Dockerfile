FROM node:20-alpine

RUN mkdir -p /code/src /app
COPY ./package*.json /code
COPY ./src /code/src
RUN cd /code && ls && \
    npm i && \
    npm run build && \
    cp dist/* /app

WORKDIR /app

EXPOSE 3456

CMD ["node", "cli.js", "start"]
