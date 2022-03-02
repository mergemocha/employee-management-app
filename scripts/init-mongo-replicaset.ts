/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../src/types/mongo-url-parser.d.ts"/>

import dotenv from 'dotenv-safe'
import parseMongoUrl from 'mongo-url-parser'
import execa from 'execa'

dotenv.config()

const url = parseMongoUrl(process.env.MONGO_URL as string)
const mongoScript = '/docker-entrypoint-initdb.d/mongo-post-init.js'

void (async () => {
  const cmd = execa('docker', ['exec', '-i', 'mongodb-primary', 'mongo', '--', url.dbName, mongoScript])
  cmd.stdout?.pipe(process.stdout)
  cmd.stderr?.pipe(process.stderr)
})()
