# Azar Hologram Backend API

NestJS and TypeScript backend for the Azar Hologram storefront and staff administration interface. It organizes shop functionality into modules for products, orders, users, authentication, roles and permissions, and site content.

## Architecture

- `src/modules/` contains feature modules, including the catalog, orders, authentication, and analytics.
- `src/core/` contains shared configuration, database, and framework code.
- `src/migrations/` contains TypeORM database migrations.
- `postman_collection.json` contains API requests for inspection and local development.

## Local development

```sh
npm ci
npm run start:dev
```

Before starting, configure a development database and local environment settings for the services you plan to exercise. Review the TypeORM data source and applicable migrations before initializing a database. Use local or staging services and test data for the storefront and admin integrations.

Use `npm run build` to compile the application and `npm run start:prod` to start the compiled build.

## Project repositories

| Repository | Role |
| --- | --- |
| [hologram-web-shop](https://github.com/amirhoseinhoseinpoor/hologram-web-shop) | Customer storefront |
| [hologram-admin-shop](https://github.com/amirhoseinhoseinpoor/hologram-admin-shop) | Staff administration interface |
| [hologram-core-shop](https://github.com/amirhoseinhoseinpoor/hologram-core-shop) | Backend API and business logic |

[View the live storefront](https://azarhologram.net/)

