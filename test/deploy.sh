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
  sed -i "s/POD_IMAGE/${FULL_TAG}/g" prod-transit-ui.yaml
  echo "$KUBERNETES_CLUSTER_CERTIFICATE" | base64 --decode > cert.crt
  /usr/local/bin/kubectl \
    --kubeconfig=open-transport-kubeconfig.yaml \
    --server=$KUBERNETES_SERVER \
    --certificate-authority=cert.crt \
    --token=$KUBERNETES_TOKEN \
    apply -f prod-transit-ui.yaml
fi
