// tests/auth.test.js
import './setup.js';

import request from 'supertest';
import app from '../src/app.js';
import { log } from 'node:console';

describe('Auth Endpoints', () => {
  let accessToken = '';
  let accessTokenNoCompany = '';
  let userEmail = '';
  let userEmailNoCompany = '';
  let userEmailInvited = '';
  
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

  const testUserNoCompany = {
    email: "usernocompany@test.com",
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

  const testInvitedUser = {
    email: "userinvited@test.com",
    password: "pass1234",
    name: "UserInvited",
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

  beforeAll(async () => {
    // Register user
    let res = await request(app)
        .post('/api/user/register')
        .send(testUser)
      
    accessToken = res.body.accessToken;
    userEmail = res.body.user.email;

    res = await request(app)
        .post('/api/user/register')
        .send(testUserNoCompany)
      
    accessTokenNoCompany = res.body.accessToken;
    userEmailNoCompany = res.body.user.email;
  })

  describe('PUT /api/user/validation', () => {
    it('should block after too many attempts', async () => {
        await request(app)
            .put('/api/user/validation')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ verificationCode: "000000" })
            .expect(400);

        await request(app)
            .put('/api/user/validation')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ verificationCode: "000000" })
            .expect(400);

        await request(app)
            .put('/api/user/validation')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ verificationCode: "000000" })
            .expect(400);

        await request(app)
            .put('/api/user/validation')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ verificationCode: "000000" })
            .expect(429);
    });
  });

  describe('PUT /api/user/register', () => {
    it('should update the lastname of the user', async () => {
        const res = await request(app)
            .put('/api/user/register')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ lastname: "New lastname" })
            .expect(200);
            
        expect(res.body.content.lastname).toBe("New lastname");
    });
  });

  describe('PATCH /api/user/company', () => {
    it('should update the company of the user with a new one', async () => {
        const res = await request(app)
          .patch('/api/user/company')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(testCompany)
          .expect(200)
    });
  });
  
  describe('PATCH /api/user/logo', () => {
    it('should upload a company logo', async () => {
        await request(app)
            .patch('/api/user/logo')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('file', Buffer.from('fake image content'), 'logo.png')
            .expect(200);
    });

    it('should fail if no file uploaded', async () => {
        await request(app)
            .patch('/api/user/logo')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(400);
    });

    it('should fail if no company linked to user', async () => {
        await request(app)
            .patch('/api/user/logo')
            .set('Authorization', `Bearer ${accessTokenNoCompany}`)
            .expect(401);
    });

  });

  describe('GET /api/user', () => {
    it('should get the information of the user', async () => {
        await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
  });

  describe('DELETE /api/user/:id?soft=true', () => {
    it('should soft-delete a user', async () => {
      const res = await request(app)
        .delete(`/api/user?soft=true`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });

    it('should not get the soft-deleted user', async () => {
      const res = await request(app)
        .get(`/api/user`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .expect(404);
    });
  });

  describe('PUT /api/user/password', () => {
    it('should change the password of the user', async () => {
        await request(app)
            .put('/api/user/password')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({currentPassword: testUser.password, newPassword: "newpassword"})
            .expect(200);
    });

    it('should refuse incorrect current password', async () => {
        await request(app)
            .put('/api/user/password')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({currentPassword: "blablabla", newPassword: "newpassword"})
            .expect(401);
    });

    it('should refuse incorrect data', async () => {
        await request(app)
            .put('/api/user/password')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({test: "blabla"})
            .expect(400);
    });
  });

  describe('POST /api/user/invite', () => {
    it('should add a new user in company', async () => {
        const res = await request(app)
            .post('/api/user/invite')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(testInvitedUser)
            .expect(200);

        expect(res.body.content.role).toBe('guest')
        userEmailInvited = res.body.content.email
    });

    it('should refuse dupplicated email', async () => {
        await request(app)
            .post('/api/user/invite')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(testInvitedUser)
            .expect(409);
    });

    it('should refuse non admin user', async () => {
        res = await request(app)
          .post('/api/user/login')
          .send({ email: testInvitedUser.email, password: testInvitedUser.password})
        await request(app)
            .post('/api/user/invite')
            .set('Authorization', `Bearer ${res.body.accessToken}`)
            .send(testInvitedUser)
            .expect(401);
    });
  });

  // Clean after testing
  afterAll(async () => {
    if (userEmail) {
      await request(app)
        .delete(`/api/user`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    // Delete user no company
    if (userEmailNoCompany) {
      await request(app)
        .delete(`/api/user`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`);
    }
    // Delete user invited
    if (userEmailInvited) {
      res = await request(app)
          .post('/api/user/login')
          .send({ email: testInvitedUser.email, password: testInvitedUser.password})
      await request(app)
          .delete(`/api/user`)
          .set('Authorization', `Bearer ${res.body.accessToken}`);
    }
  });
});