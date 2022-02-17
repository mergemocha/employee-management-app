#!/bin/bash
# Initialises the MongoDB database for Prisma.
# Prisma needs the database to exist, which means that we need to create a dummy table
# (which mandates adding at least one document, which we can then immediately delete),
# before Prisma can do its thing.

mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    const rootUser = '$MONGO_INITDB_ROOT_USERNAME'
    const rootPassword = '$MONGO_INITDB_ROOT_PASSWORD'
    const initDb = '$MONGO_INITDB_DATABASE'

    const admin = db.getSiblingDB('admin')
    admin.auth(rootUser, rootPassword)

    db.createUser({
      user: rootUser,
      pwd: rootPassword,
      roles: [
        {
          role: 'dbOwner',
          db: initDb
        }
      ]
    })

    db.init.insertOne({ document: 'test', tags: ['test'], content: 'test' })
    db.init.deleteOne({ document: { \$eq: 'test' } })
EOF
