# KroyNext E-Commerce API

A modern e-commerce backend API built with NestJS, Prisma, Stripe, and Swagger.

## Project Links

- **GitHub Repository**:https://github.com/saifulislam106/kroynext/tree/backup-safe
- **API Documentation**: https://kroynext.onrender.com/api/docs

## Tech Stack

- **NestJS** - Node.js framework
- **Prisma** - ORM for database operations
- **Stripe** - Payment processing
- **Swagger** - API documentation
- **PostgreSQL** - Database
- **TypeScript** - Programming language

## Features

- User authentication & authorization (JWT)
- Product management (CRUD)
- Shopping cart system
- Order processing
- Stripe payment integration
- API documentation with Swagger
- Role-based access control (Admin/Customer)

## Installation

```bash
# Clone repository
git clone https://github.com/saifulislam106/kroynext.git
cd kroynext/server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma migrate dev
npx prisma generate




## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Database Commands

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed 

## Author
Saiful Islam
