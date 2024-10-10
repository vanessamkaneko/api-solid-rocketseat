import 'dotenv/config';
import { z } from 'zod'; // p/ validaçãoes de variáveis de ambiente

// process.env: { NODE_ENV: 'dev', ...} -> por isso no envSchema estamos validando um obj.
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'), // enum -> uma entre algumas das opções
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333), // coerce -> irá converter qualquer tipo de valor p/ number; se port não estiver informada -> 3333
})

const _env = envSchema.safeParse(process.env) // validando process.env p/ verificar se confere c/ o envSchema

if(_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data

