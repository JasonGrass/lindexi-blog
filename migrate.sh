#!/bin/bash

cd ../lindexi
while true; do
    git pull
    if [ $? -eq 0 ]; then
        echo "pull successful!"
        break
    else
        echo "pull failed, retrying in 2 seconds..."
        sleep 2
    fi
done

echo "====================================="

cd ../lindexi.github.io

while true; do
    git pull
    if [ $? -eq 0 ]; then
        echo "pull successful!"
        break
    else
        echo "pull failed, retrying in 2 seconds..."
        sleep 2
    fi
done

echo "====================================="

cd ../lindexi-blog

while true; do
    git pull
    if [ $? -eq 0 ]; then
        echo "pull successful!"
        break
    else
        echo "pull failed, retrying in 2 seconds..."
        sleep 2
    fi
done

echo "====================================="

yarn migrate
