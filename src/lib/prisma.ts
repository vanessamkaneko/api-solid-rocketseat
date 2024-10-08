import { PrismaClient } from "@prisma/client"; // biblioteca de acesso ao bd gerada automaticamente a partir do schema do Prisma
import { env } from "@/env";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : []
});