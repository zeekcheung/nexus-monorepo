# nexus-monorepo

This is a monorepo for personal projects.

## 📖 Documentation

### 📦 Bun Workspace Management

- [Workspaces](https://bun.com/docs/pm/workspaces) – Develop complex monorepos with multiple independent packages
- [Catalogs](https://bun.com/docs/pm/catalogs) – Share dependency versions across packages
- [bun link](https://bun.com/docs/pm/cli/link) – Link local packages for development
- [bun pm](https://bun.com/docs/pm/cli/pm) – Package manager utilities

### 🛠 Development Tooling

- [EditorConfig](https://editorconfig.org/) – Consistent coding styles across editors
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) – High-performance linter for JS & TS
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) – High-performance formatter
- [Husky](https://typicode.github.io/husky/) – Git hooks for linting & testing
- [Vitest](https://vitest.dev/) - Next generation testing framework powered by Vite

### 🚀 Runtime Targets

- [Hono](https://hono.dev/) - Small, simple, and ultra fast web framework built on Web Standards
- [Electrobun](https://blackboard.sh/electrobun/docs/) - Ultra fast and tiny desktop app framework

## 🗂 Project Structure

```asciidoc
nexus-monorepo/
├── apps/                             # Applications
│   ├── cli/                          # Command Line applications
│   │   └── tsconfig.cli.json         # Command Line applications TypeScript config
│   ├── desktop/                      # Desktop applications
│   │   └── tsconfig.desktop.json     # Desktop applications TypeScript config
│   ├── workers/                      # Cloudflare workers
│   │   └── tsconfig.workers.json     # Cloudflare workers TypeScript config
├── packages/                         # Packages
│   └── shared/                       # Shared utilities, constants, and types
│   └── devtools/                     # Shared devtools
├── scripts/                          # Repo level shell scripts
├── types/                            # Repo level TypeScript type definitions
├── .editorconfig                     # Root EditorConfig config
├── .oxfmtrc.json                     # Root Oxfmt config
├── .oxlintrc.json                    # Root Oxlint config
├── package.json                      # Root package.json
├── tsconfig.base.json                # Base TypeScript config
```

## 🚀 Getting started

```bash
# Install dependencies
bun install

# Run all apps in normal mode
bun run start

# Run all apps in development mode
bun run dev

# Build all apps
bun run build

# Deploy all apps
bun run deploy

# Test all apps
bun run test          # Without watch mode
bun run test:watch    # With watch mode

# Test only affected files
bun run test:affected

# Format all files
bun run fmt
bun run fmt:check     # Check only

# Lint all files
bun run lint          # Check only
bun run lint:fix      # Fix files
```
