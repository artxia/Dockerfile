FROM redis:latest as src-redis

FROM python:3.9 AS BUILDER

WORKDIR /app

COPY . /app

RUN pip install \
    --no-cache-dir \
    --trusted-host pypi.python.org \
    --use-feature=in-tree-build \
    --disable-pip-version-check \
    /app

FROM python:3.9-slim

WORKDIR /app

COPY . /app

COPY --from=src-redis /usr/local/bin/redis* /usr/bin/
COPY redis.conf /etc/redis/redis.conf
COPY --from=BUILDER \
    /usr/local/lib/python3.9/site-packages \
    /usr/local/lib/python3.9/site-packages


RUN mkdir /usr/local/lib/python3.9 -p
RUN mkdir /data

VOLUME /data

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
