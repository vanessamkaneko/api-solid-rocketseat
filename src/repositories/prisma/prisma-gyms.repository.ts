import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, IGymsRepository } from "../IGyms.repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string)  {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams)  {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) *
     cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) *
     sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query
        },
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data
    })

    return gym
  }
}

/* findManyNearby: 
A query SQL apresentada está realizando uma busca de todas as academias que estão a uma distância máxima de 10km da localização
representada pela latitude e longitude informadas como parâmetros. A fórmula utilizada no WHERE é conhecida como Haversine
Formula, e é utilizada para calcular a distância entre dois pontos em um globo. O resultado é multiplicado por 6371 
para obter a distância em quilômetros.
*/