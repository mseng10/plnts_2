#!/bin/bash

# Build and push Docker images
docker build -t your-registry/backend:latest ./backend
docker build -t your-registry/frontend:latest ./frontend
docker push your-registry/backend:latest
docker push your-registry/frontend:latest

# Apply Kubernetes configurations
kubectl apply -k ./k8s

# Set up Nginx reverse proxy on non-Kubernetes server
ssh user@non-kubernetes-server 'sudo apt-get update && sudo apt-get install -y nginx'
scp ./nginx/nginx.conf user@non-kubernetes-server:/etc/nginx/nginx.conf
ssh user@non-kubernetes-server 'sudo systemctl restart nginx'

# Set up WireGuard VPN
scp ./vpn/wireguard-config.conf user@server:/etc/wireguard/wg0.conf
ssh user@server 'sudo systemctl start wg-quick@wg0'