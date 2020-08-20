#!/bin/bash
set -e

REPO=$(git remote get-url --push origin | sed -e "s/[.]git$/$2/g" | sed -e "s/^.*\///g")
BRANCH="$TRAVIS_BRANCH"
APP="$REPO-$BRANCH"
TAG=$(git rev-parse --short HEAD)
FULL_TAG="registry.app.opentsr.com/cityradar/$APP:$TAG"

if [[ -n "$TRAVIS_TAG" || ( "$TRAVIS_PULL_REQUEST" = "false") ]]; then
  # Don't build pull requests or tagged commits
  echo "Building and publishing: $APP:$TAG"
  docker login -u "$KUBE_DOCKER_USER" -p "$KUBE_DOCKER_AUTH" registry.app.opentsr.com
  docker build -f Dockerfile -t "$FULL_TAG" . && docker push "$FULL_TAG"
  rm -rf deployment
  git clone -b main git@github.com:opentransportro/kube-hosting.git deployment
  export KUBECONFIG="$(pwd)/deployment/kubeconfig/open-transport-kubeconfig.yaml"
  kubectl get pods
  rm -rf deployment
fi
