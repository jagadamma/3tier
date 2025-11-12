#!/bin/bash

set -e

KUBE_VERSION="v1.33.0"
ARCH="amd64"
OS="linux"

echo "Downloading kubectl $KUBE_VERSION for $OS/$ARCH..."
curl -LO "https://dl.k8s.io/release/${KUBE_VERSION}/bin/${OS}/${ARCH}/kubectl"

echo "Making kubectl executable..."
chmod +x kubectl

echo "Moving kubectl to /usr/local/bin..."
sudo mv kubectl /usr/local/bin/kubectl

echo "Verifying installation..."
kubectl version --client

echo "kubectl $KUBE_VERSION installed successfully!"
