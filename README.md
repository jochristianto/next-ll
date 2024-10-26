# next-ll

This template should help get you started developing with Vue 3 in Vite.

## Preview

![Preview](./docs/preview.png "Preview")

## Demo

Demo is available on vercel, [https://next-ll.vercel.app](https://next-ll.vercel.app)

## Requirements

### Node.js

This project require specific version of node.js, refer to `.nvmrc` for the exact version.

If you're using [nvm](https://github.com/nvm-sh/nvm), you can run `nvm use` to automatically use the required version.

### Bun

This project is using [bun](https://bun.sh) as its package manager.

```sh
# Install bun
npm install -g bun

# Verify installation, should return `1.1.33` or equivalent
bun -v
```

Alternatively, you can use `npm`, `pnpm`, or `yarn` at your own risk.

## Project Setup

```sh
bun install --frozen-lockfile
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Compile and Minify for Production

```sh
bun run build
```

### Preview production build locally

```sh
bun run start
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```
