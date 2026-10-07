# `create-mivo`

The official scaffolding and initialization CLI for **MIVO** — a high-performance Next.js MikroTik hotspot & voucher management platform.

Modeled after industry-standard tools like `create-cloudflare` and `create-next-app`.

---

## Quick Start

### Interactive Mode (Standard)

```bash
npx create-mivo [dir]
# or
pnpm create mivo [dir]
# or
bun create mivo [dir]
```

This launches an interactive terminal interface powered by [Ink](https://github.com/vadimdemedes/ink), featuring:
1. **Preflight Doctor**: Validates Node.js version (`>= 20.0.0`) and target directory write permissions.
2. **Project Path Selector**: Custom or default directory input with live validation.
3. **Package Manager Selector**: Interactive choice between `pnpm` (recommended), `npm`, `bun`, and `yarn`.
4. **Superadmin Provisioning**: Interactive form for username, email, and masked password input.
5. **Cryptographic Secret Generator**: Previews a 32-byte hex token with interactive key regeneration (`[↻]` or custom input).
6. **Multi-Task Runner**: Live animated terminal spinners for scaffolding, `.env` injection, SQLite provisioning, Drizzle migrations, and seeding.
7. **Summary Screen**: Dynamic next-steps instructions customized to your chosen package manager.

---

## Headless Mode (CI/CD & Docker)

For automated environments, Docker containers, or non-interactive scripts:

```bash
npx create-mivo my-mivo \
  --admin-user admin \
  --admin-email admin@example.com \
  --admin-password mysecretpass \
  --pm pnpm \
  --yes
```

### CLI Flags

| Flag | Type | Description |
| :--- | :--- | :--- |
| `[dir]` | `string` | Target folder name (default: `mivo-app`) |
| `--admin-user <name>` | `string` | Superadmin username |
| `--admin-email <email>` | `string` | Superadmin email address |
| `--admin-password <pass>` | `string` | Superadmin password (minimum 8 characters) |
| `--secret <hex>` | `string` | 32-byte hex secret key (auto-generated if omitted) |
| `--pm <manager>` | `string` | Package manager to use (`pnpm`, `npm`, `yarn`, `bun`) |
| `--use-pnpm` | `boolean` | Use `pnpm` as package manager |
| `--use-npm` | `boolean` | Use `npm` as package manager |
| `--use-yarn` | `boolean` | Use `yarn` as package manager |
| `--use-bun` | `boolean` | Use `bun` as package manager |
| `-y, --yes` | `boolean` | Non-interactive execution (accepts defaults & flags) |
| `--dry-run` | `boolean` | Simulate execution without writing files to disk |
| `-h, --help` | `boolean` | Display CLI help and flag reference |
| `-V, --version` | `boolean` | Display installed version |

---

## Development

```bash
# Typecheck
pnpm check:type

# Build bundle
pnpm build

# Watch mode
pnpm dev
```
