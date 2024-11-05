import 'dotenv/config'

import { randomUUID } from "node:crypto";
import { execSync } from 'node:child_process';
import { Environment } from "vitest/environments";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

// "process.env.DATABASE_URL" --> postgresql://docker:docker@localhost:5432/apisolid?schema=public"

/* p/ cada arquivo de teste, será gerada uma nova url de banco de dados: 
ex: postgresql://docker:docker@localhost:5432/apisolid?schema=43801d98-3c49-4208-9ef0-8eac5f0812b6 
(parte do "schema=" sendo gerada pelo randomUUID())
*/

function generateDataBaseURL(schema: string) {
  if(!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>(<unknown>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDataBaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        )

        await prisma.$disconnect()
      },
    }
  },
})

/* setup -> execução de comandos antes de cada arquivo de teste ser executado
teardown -> execução de comandos depois de cada arquivo de teste ser executado
*/

