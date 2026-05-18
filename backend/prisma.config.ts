import 'dotenv/config'; // Ensures your local .env variables are loaded
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  migrations: {
    // Tell Prisma to execute your JavaScript seed file using Node
    seed: 'node ./prisma/seed.js',
  },
  datasource: {
    // env() is now safely imported and available to read DATABASE_URL
    url: env('DATABASE_URL'),
  },
});