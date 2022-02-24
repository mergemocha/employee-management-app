const admin = db.getSiblingDB('admin')
admin.auth(_getEnv('MONGO_INITDB_ROOT_USERNAME'), _getEnv('MONGO_INITDB_ROOT_PASSWORD'))

rs.initiate({
  _id: 'mongo-cluster',
  members: [
    {
      _id: 0,
      host: 'mongodb-primary:27017',
      priority: 1
    },
    {
      _id: 1,
      host: 'mongodb-replica:27017',
      priority: 0.5
    }
  ]
})
