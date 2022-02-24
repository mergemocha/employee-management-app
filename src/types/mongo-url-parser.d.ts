declare module 'mongo-url-parser' {
  interface MongoServer {
    host: string
    port: number
  }

  interface MongoUrl {
    usingSrv: boolean
    auth?: {
      user: string
      password: string
    }
    server_options: {
      socketOptions: {}
    }
    db_options: {
      read_preference_tags?: string[]
      authSource?: string
      read_preference?: string
    }
    rs_options: {
      socketOptions: {}
    }
    mongos_options: {}
    dbName: string
    servers: MongoServer[]
  }

  function parse (url: string): MongoUrl
  export = parse
}
