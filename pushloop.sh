#!/bin/bash

while true; do
    git push
    if [ $? -eq 0 ]; then
        echo "Push successful!"
        break
    else
        echo "Push failed, retrying in 5 seconds..."
        sleep 5
    fi
done