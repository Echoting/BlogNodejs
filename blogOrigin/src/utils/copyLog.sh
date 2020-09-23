#!/bin/sh
cd /Users/zhuting03/Documents/EchoStudy/nodejs/blogOrigin/logs
cp access.log $(date +%Y-%m-%d).access.log

echo "" > access.log