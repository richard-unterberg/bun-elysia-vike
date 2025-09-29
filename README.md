# bun + elysia + vike

This is a minimal example of using [Bun](https://bun.sh/) with [Elysia](https://elysiajs.com/) and [Vike](https://vike.dev/). For instant UI development, the `vike-react` extension is used to provide some basic components.

This example mainly serves the purpose to use current versions of Elysia (`>=1.3.0`) and Vike together with bun, as Vike's `vike-server` package does not support Elysia's new API yet. See [What about vike-server?](#what-about-vike-server) for more info.

## Coming from Node.js (npm, yarn, pnpm)?

Cool! Bun is a drop-in replacement for Node.js, so you can use the same package.json, same dependencies, etc. Just replace `node` with `bun`/`bunx` in your `package` scripts.

### Lockfile

If you start a new project, it's suggested to use `bun install` to create a `bun.lockb` file, which is Bun's lockfile format. See [Bun: Lockfile](https://bun.com/docs/install/lockfile) for more info.

If you want to keep using your existing `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`, that's also possible. Bun will read those lockfiles and create a `bun.lockb` file on the first `bun install`. See [Bun: Using Existing Lockfiles](https://bun.com/blog/bun-lock-text-lockfile) for more info.

## `server.ts` entry

The [./server.ts](https://github.com/richard-unterberg/bun-elysia-vike/blob/main/server.ts) file is the entry point of your application on a server. It can be easily swapped out with frameworks like Fastify, Express, Koa, etc.

The important part is the `renderPage` function from Vike, which is framework-agnostic. See [Vike: renderPage()](https://vike.dev/renderPage) for more info.

## What about `vike-server`?

As you maybe stumbled upon, Vike has a `vike-server` package which should provide a server adapter for Elysia and makes this repo kinda obsolete. However Eylisia Version `>=1.3.0` changed its API in a way that `vike-server` does not supports at the moment. [See Issue](https://github.com/vikejs/vike-server/issues/130). The vike team is aware of this and a fix is in the works. 

install deps
```shell
bun install
```

run dev
```shell
bun run dev
```

run prod like
```shell
bun run prod
```

run build only
```shell
bun run build
```

start prod server only
```shell
bun run start
```
