#!/bin/bash
set -e

# Dump env for debugging purposes
env

REPO=$(git remote get-url --push origin | sed -e "s/[.]git$/$2/g" | sed -e "s/^.*\///g")
BRANCH=$(git rev-parse --abbrev-ref HEAD)
APP="$REPO-$BRANCH"
TAG=$(git rev-parse --short HEAD)
FULL_TAG="registry.app.opentsr.com/cityradar/$APP:$TAG"

# Dump tag extracted via git
echo $FULL_TAG

REPO=transit-ui
BRANCH="$TRAVIS_BRANCH"
APP="$REPO-$BRANCH"
TAG="$TRAVIS_COMMIT"
FULL_TAG="registry.app.opentsr.com/cityradar/$APP:$TAG"

if [[ -n "$TRAVIS_TAG" || ( "$TRAVIS_PULL_REQUEST" = "false") ]]; then
  # Don't build pull requests or tagged commits
  echo "Building and publishing: $APP:$TAG"
  docker login -u "$KUBE_DOCKER_USER" -p "$KUBE_DOCKER_AUTH" registry.app.opentsr.com
  docker build -f Dockerfile -t "$FULL_TAG" . && docker push "$FULL_TAG"
fi
