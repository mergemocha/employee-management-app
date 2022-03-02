#!/bin/bash

set -e

if [[ "$EUID" -ne 0 ]]; then
  echo "This script must be run as root."
  exit 1
fi

cat <<EOF >> /etc/hosts
# Added for employee-management-app-backend
127.0.0.1 mongodb-primary
127.0.0.1 mongodb-replica
# End of section
EOF
