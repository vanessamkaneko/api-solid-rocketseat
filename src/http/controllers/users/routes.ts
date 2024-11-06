import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./get-user-profile.controller";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // rota autenticada
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
