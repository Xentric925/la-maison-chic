# la-maison-chic

In the root directory:

- Create `.env` and then copy the contents of `.env.sample`
- Run `npm start`

## Frontend

NextJS web app: http://localhost:3000/

While editing SCSS files, activate auto compiling inside `web-app` directory:

```
npm run css:watch
```

## Backend

Node and Express API: http://localhost:5000/

Swagger API Docs: http://localhost:5000/api/v1/docs/

## Jobs

Service that executes jobs asynchronously.

Important: make sure to have db prisma types synced by executing the following inside `jobs`:

```
sh sync-types.sh
```

## Migrations

We use Prisma for managing the Database.

To create a new migration:

- Navigate to `db-api` directory
- Implement your DB modifications inside `schema.prisma`
- Run:

```
npm run db:migrate
```

## Team Modules

- Daoud El Bayah: Admin Dashboard Module
- Nivine Arabi: Dashboard, Org Chart and Calendar Module
- Jad Sarkis: Talent Pool module
- Keven Sakr: Performance Review Module.
- Fatima Abadi: Onboarding Offboarding and Reporting Module

### Seeding

In the root directory run:

```
npm run seed
```

