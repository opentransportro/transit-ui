#!/bin/bash
set -e

DOCKER_IMAGE="opentransport/transit-ui"
DOCKER_TAG="prod"

COMMIT_HASH=$(git rev-parse --short "$GITHUB_SHA")

DOCKER_TAG_LONG=$DOCKER_TAG-$(date +"%Y-%m-%dT%H.%M.%S")-$COMMIT_HASH
DOCKER_IMAGE_TAG=$DOCKER_IMAGE:$DOCKER_TAG
DOCKER_IMAGE_TAG_LONG=$DOCKER_IMAGE:$DOCKER_TAG_LONG
DOCKER_IMAGE_LATEST=$DOCKER_IMAGE:latest

docker login -u $DOCKER_USER -p $DOCKER_AUTH

echo "processing prod release"
docker pull $DOCKER_IMAGE_LATEST
docker tag $DOCKER_IMAGE_LATEST $DOCKER_IMAGE_TAG
docker tag $DOCKER_IMAGE_LATEST $DOCKER_IMAGE_TAG_LONG
docker push $DOCKER_IMAGE_TAG
docker push $DOCKER_IMAGE_TAG_LONG

echo Build completed

APP="transit-ui-opentransport"
FULL_TAG="registry.app.opentsr.com/cityradar/$APP:$COMMIT_HASH"

# Don't build pull requests or tagged commits
echo "Building and publishing: $APP:$COMMIT_HASH"
docker login -u "$KUBE_DOCKER_USER" -p "$KUBE_DOCKER_AUTH" registry.app.opentsr.com
docker build --tag=$FULL_TAG . && docker push $FULL_TAG

sed -i "s|POD_IMAGE|${FULL_TAG}|g" test/prod-transit-ui.yaml
echo "$KUBERNETES_CLUSTER_CERTIFICATE" | base64 --decode > cert.crt
/usr/local/bin/kubectl \
    --kubeconfig=test/open-transport-kubeconfig.yaml \
    --server=$KUBERNETES_SERVER \
    --certificate-authority=cert.crt \
    --token=$KUBERNETES_TOKEN \
    apply -f test/prod-transit-ui.yaml