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
3. **Superadmin Provisioning**: Interactive form for username, email, and masked password input.
4. **Cryptographic Secret Generator**: Previews a 32-byte hex token with interactive key regeneration (`[↻]` or custom input).
5. **Multi-Task Runner**: Animated terminal spinners for scaffolding, `.env` injection, SQLite provisioning, Drizzle migrations, and seeding.
6. **Summary Screen**: Next steps instructions to launch your new instance.

---

## Headless Mode (CI/CD & Docker)

For automated environments, Docker containers, or non-interactive scripts:

```bash
npx create-mivo my-mivo \
  --admin-user admin \
  --admin-email admin@example.com \
  --admin-password mysecretpass \
  --secret 764ab113861a0de261df0175a20519bed184061a9ed8af53d63c9892b75c5d288 \
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
