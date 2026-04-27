// tests/auth.test.js
import './setup.js';

import request from 'supertest';
import app from '../src/app.js';
import { log } from 'node:console';

describe('Auth Endpoints', () => {
  let accessToken = '';
  let refreshToken = '';
  let userEmail = '';
  
  // User Testing
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

  describe('POST /api/user/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send(testUser)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201);
      
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.role).toBe('admin');
      expect(res.body.user).not.toHaveProperty('password');
      
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
      userEmail = res.body.user.email;
    });

    it('should refuse duplicated email', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send(testUser)
      
      expect(res.status).toBe(409);
    });

    it('should refuse incorrect data', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({ email: 'invalid' })
        .expect(400);
      
    });
  });

  describe('POST /api/user/login', () => {
    it('should login correctly', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should refuse incorrect password', async () => {
      await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        })
        .expect(401);
    });

    it('should refuse unexisting users', async () => {
      await request(app)
        .post('/api/user/login')
        .send({
          email: 'noexiste@example.com',
          password: 'TestPassword123'
        })
        .expect(404);
    });
  });

  describe('Protected routes', () => {
    it('should access with correct token', async () => {
      const res = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      
      expect(res.body.email).toBe(testUser.email);
    });

    it('should refuse without accessToken', async () => {
      await request(app)
        .get('/api/user')
        .expect(401);
    });

    it('should refuse with incorrect accessToken', async () => {
      await request(app)
        .get('/api/user')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);
    });
  });

  // Clean after testing
  afterAll(async () => {
    console.log("hello")
    if (userEmail) {
      console.log("hello again")
      await request(app)
        .delete(`/api/user`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
  });
});