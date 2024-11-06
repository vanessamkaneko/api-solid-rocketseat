import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./create-checkin.controller";
import { validate } from "./validate-checkin.controller";
import { metrics } from "./get-user-metrics.controller";
import { history } from "./user-checkins-history.controller";

export async function checkInRoutes(app: FastifyInstance) {
 app.addHook('onRequest', verifyJWT) // todas as rotas daqui p/ baixo o user precisará estar autenticado

 app.get('/check-ins/history', history)
 app.get('/check-ins/metrics', metrics)

 app.post('/gyms/:gymId/check-ins', create)
 app.patch('/check-ins/:checkInId/validate', validate)

}
