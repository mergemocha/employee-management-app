#!/bin/bash

set -e

# Ensure script can only run once
if [[ -f "/.firstboot" ]]; then
  echo "This container is only needed for the initial boot process. Please recreate the environment to reuse it (or delete /.firstboot if you know what you're doing)."
  exit 0
else
  touch /.firstboot
fi

# We know the DB is ready when the driver endpoint no longer gives ECONNREFUSED or empty reply
until curl -sSL mongodb-primary:27017;
  do echo "Primary database not yet ready, sleeping."
  sleep 3;
done

echo "Primary database ready."

until curl -sSL mongodb-replica:27017;
  do echo "Secondary database not yet ready, sleeping."
  sleep 3;
done

echo "Replica database ready."

echo "Initialising replica set."

/opt/mongosh/mongosh -- "$(echo "$MONGO_URL" | sed 's/localhost/mongodb-primary/')" /mongo-post-init.js
