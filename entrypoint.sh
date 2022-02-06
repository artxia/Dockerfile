#!/bin/bash

# fix WARNING overcommit_memory is set to 0! Background save may fail under low memory condition.

sed -i 's/^\(bind .*\)$/# \1/' /etc/redis/redis.conf && \
sed -i 's/^\(daemonize .*\)$/# \1/' /etc/redis/redis.conf && \
sed -i 's/^\(dir .*\)$/# \1\ndir \/data/' /etc/redis/redis.conf && \
sed -i 's/^\(logfile .*\)$/# \1/' /etc/redis/redis.conf

# start redis server

redis-server /etc/redis/redis.conf --appendonly yes --appendfilename "redis_db.aof" --appendfsync everysec && \
		--no-appendfsync-on-rewrite no --auto-aof-rewrite-percentage 100 && \
		--auto-aof-rewrite-min-size 64mb --aof-load-truncated yes 2>&1 &
python -m tg_searcher -f ./config/searcher.yaml
