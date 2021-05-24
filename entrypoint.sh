#!/bin/bash

redis-server /etc/redis/redis.conf 2>&1 &
python main.py