#!/bin/bash

IMAGE=64.176.80.210:5000/personal-finance-next

if [ -n "$1" ]; then VERSION=$1; else VERSION="latest";fi

echo "Building image $IMAGE:$VERSION"

docker build --platform=linux/amd64 -t $IMAGE:$VERSION .
docker push $IMAGE:$VERSION
