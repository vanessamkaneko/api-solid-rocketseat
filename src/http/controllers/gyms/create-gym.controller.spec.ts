import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

      const response = await request(app.server)
      .post('/gyms')    
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: 'blablabla', 
        phone: '11223344', 
        latitude: -23.3245219,
        longitude: -51.1689972
      })

      expect(response.statusCode).toEqual(201)
  })
})