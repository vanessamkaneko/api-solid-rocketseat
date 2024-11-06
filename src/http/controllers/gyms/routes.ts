import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search-gyms.controller";
import { nearby } from "./nearby-gyms.controller";
import { create } from "./create-gym.controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
 app.addHook('onRequest', verifyJWT) // todas as rotas daqui p/ baixo o user precisará estar autenticado

 app.get('/gyms/search', search)
 app.get('/gyms/nearby', nearby)

 app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
