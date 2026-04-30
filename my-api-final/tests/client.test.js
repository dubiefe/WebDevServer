// tests/auth.test.js
import './setup.js';

import request from 'supertest';
import app from '../src/app.js';
import { log } from 'node:console';

describe('Auth Endpoints', () => {
  let accessToken = '';
  let refreshToken = '';
  let userEmail = '';
  let clientId = '';
  
  // Client Testing
  const testUser = {
    email: "user@test.com",
    password: "pass1234",
    name: "User",
    lastname: "Testing",
    nif: "ABC123",
    address: {
      street: "Calle de la Test",
      number: "10",
      postal: "28000",
      city: "Madrid",
      province: "Madrid"
    }
  };

  const testCompany = {
    name: "Google",
    cif: "123456",
    address: {
      street: "Calle de la Test",
      number: "10",
      postal: "28000",
      city: "Madrid",
      province: "Madrid"
    },
    isFreelance: true
  }

  const testClient = {
    name: "User",
    email: "user@test.com",
    cif: "ABC123",
    address: {
      street: "Calle de la Test",
      number: "10",
      postal: "28000",
      city: "Madrid",
      province: "Madrid"
    }
  };

  beforeAll(async () => {
    // Register user
    let res = await request(app)
        .post('/api/user/register')
        .send(testUser)
      
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    userEmail = res.body.user.email;

    // Create Company data
    res = await request(app)
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testCompany)
  })

  describe('POST /api/client/', () => {
    it('should create a new client', async () => {
      const res = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testClient)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      clientId = res.body.content._id
    });

    it('should refuse duplicated cif', async () => {
      const res = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testClient)
      
      expect(res.status).toBe(409);
    });

    it('should refuse incorrect data', async () => {
      const res = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('GET /api/client', () => {
    it('should get at least one client', async () => {
      const res = await request(app)
        .get(`/api/client`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });

    it('should get at least one client with pagination', async () => {
      const res = await request(app)
        .get(`/api/client?page=1&limit=2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('totalItems');
      expect(res.body).toHaveProperty('currentPage');
    });
  });

  describe('PUT /api/client/:id', () => {
    it('should soft-delete a client', async () => {
      const res = await request(app)
        .put(`/api/client/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: "newTest"
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      expect(res.body.content.name).toBe("newTest");
    });
  });

  describe('DELETE /api/client/:id?soft=true', () => {
    it('should soft-delete a client', async () => {
      const res = await request(app)
        .delete(`/api/client/${clientId}?soft=true`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });
  });

  describe('GET /api/client/archived', () => {
    it('should get at least one archived client', async () => {
      const res = await request(app)
        .get(`/api/client/archived`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });
  });

  describe('GET /api/client/:id', () => {
    it('should return no client', async () => {
      const res = await request(app)
        .get(`/api/client/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /api/client/:id/restore', () => {
    it('should restore the client', async () => {
      const res = await request(app)
        .patch(`/api/client/${clientId}/restore`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('GET /api/client/:id', () => {
    it('should find the client', async () => {
      const res = await request(app)
        .get(`/api/client/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  // Clean after testing
  afterAll(async () => {
    // Delete client
    if(clientId) {
      await request(app)
        .delete(`/api/client/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    // Delete user
    if (userEmail) {
      await request(app)
        .delete(`/api/user`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
  });
});