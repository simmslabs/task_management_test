# Task Management Test!

## Development

First todo after clonning:

```sh
pnpm install
npx prisma db push
# If using an old prisma version the run --> npx prisma generate
pnpm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
pnpm install
npx prisma db push
# If using an old prisma version the run --> npx prisma generate
pnpm run build
```

Then run the app in production mode:

```sh
pnpm run start
```