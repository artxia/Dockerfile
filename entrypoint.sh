#!/bin/bash

# fix WARNING overcommit_memory is set to 0! Background save may fail under low memory condition.

sysctl vm.overcommit_memory=1

# start redis server

redis-server /etc/redis/redis.conf 2>&1 &
python main.py
