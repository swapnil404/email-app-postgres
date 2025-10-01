```
Simple Email app built with Hono, Drizzle ORM and PostgreSQL with JWT auth.
```

```
npm install

# Set up database schema
npm run db:generate
npm run db:push

npm run dev
```

```
create a .env file containing:
DATABASE_URL=<your postgresql connection string>
JWT_SECRET=<some secret string>
```

```
open http://localhost:3000
```
