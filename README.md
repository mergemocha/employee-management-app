# employee-management-app-backend

Course project for Web-sovelluskehitys 2 TX00DZ38-3004 at Metropolia UAS. Backend component.

## Setup

Prerequisites:

- [Docker and Docker Compose](https://docker.io)
- (For production: [OpenSSL](https://www.openssl.org))

```bash
cp .env.example .env
cp mongodb.env.example mongodb.env
# Edit any values as necessary
```

On Mac: You will need to edit /etc/hosts to correctly route traffic to MongoDB containers due to a known limitation of Docker. Add the following lines:

```h
127.0.0.1 mongodb-primary
127.0.0.1 mongodb-replica
```

For development:

```bash
docker compose -f docker-compose.development.yml up -d
npm run db:init
npm run prisma:up
npm start
```

For production:

```bash
npm run prisma:gen
npm run key:gen
# If on *nix: chmod 400 ./docker-entrypoint-initdb.d/prod.key
docker compose -f docker-compose.production.yml up -d
```

## Usage

On first boot, a superuser account will automatically be created. The credentials for this user will be outputted to the terminal **ONLY**. If you lose the superuser credentials, you will need to start over.

## Development

### Editing the Prisma schemas

When making edits to the Prisma schemas, remember to update the database by running `npm run prisma:up`. This ensures the database remains in sync with the downstream state.

### Routing

The API is structured as follows:

- `/api`
  - `/[version]`
    - `index.ts`: API version zone root (register all subzone route handlers)
    - `/[subzone]`
      - `index.ts`: Subzone root (registers all route handlers for the subzone)
      - `/routes`
        - `[route].ts`
