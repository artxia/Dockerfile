#!/bin/bash

# fix WARNING overcommit_memory is set to 0! Background save may fail under low memory condition.

sed -i 's/^\(bind .*\)$/# \1/' /etc/redis/redis.conf && \
sed -i 's/^\(daemonize .*\)$/# \1/' /etc/redis/redis.conf && \
sed -i 's/^\(dir .*\)$/# \1\ndir \/data/' /etc/redis/redis.conf && \
sed -i 's/^\(logfile .*\)$/# \1/' /etc/redis/redis.conf

sudo sysctl vm.overcommit_memory=1

# start redis server

redis-server /etc/redis/redis.conf 2>&1 &
python -m tg_searcher -f /path/to/config.yaml
