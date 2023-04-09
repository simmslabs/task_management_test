# Task Management Test!

## Development

Start the Remix development asset server and the Express server by running:

```sh
pnpm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm run start
```