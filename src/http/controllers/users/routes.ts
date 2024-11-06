import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./get-user-profile.controller";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh-token.controller";

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  // rota autenticada
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
