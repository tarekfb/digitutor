#!/bin/bash
set -e

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$CURRENT_BRANCH" == "master" || "$CURRENT_BRANCH" == "dev" ]]; then
  echo "You are on the '$CURRENT_BRANCH' branch. Commits to master and dev is not permitted. Exiting."
  exit 1
fi
