import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/schema/todo.ts',
    out: './drizzle',
    dialect: 'postgresql',
});
