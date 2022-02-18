# employee-management-app-backend

Course project for Web-sovelluskehitys 2 TX00DZ38-3004 at Metropolia UAS. Backend component.

## Setup

Prerequisites:

- [Docker and Docker Compose](https://docker.io)

```bash
cp .env.example .env
cp mongodb.env.example mongodb.env
# Edit any values as necessary
```

For development:

```bash
docker compose -f docker-compose.development.yml up -d
npm run prisma:up
npm start
```

For production:

```bash
npm run prisma:gen
docker compose -f docker-compose.production.yml up -d
```

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
