FROM redis:latest as src-redis

FROM python:3.7-slim

WORKDIR /app

COPY . /app

COPY --from=src-redis /usr/local/bin/redis* /usr/bin/
COPY redis.conf /etc/redis/redis.conf

RUN pip install telethon pyyaml whoosh jieba redis requests[socks]
RUN mkdir /data && \
  sed -i 's/^\(bind .*\)$/# \1/' /etc/redis/redis.conf && \
  sed -i 's/^\(daemonize .*\)$/# \1/' /etc/redis/redis.conf && \
  sed -i 's/^\(dir .*\)$/# \1\ndir \/data/' /etc/redis/redis.conf && \
  sed -i 's/^\(logfile .*\)$/# \1/' /etc/redis/redis.conf

VOLUME /data

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
