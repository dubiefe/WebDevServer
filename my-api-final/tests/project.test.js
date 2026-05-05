// tests/project.test.js
import './setup.js';

import request from 'supertest';
import app from '../src/app.js';
import { log } from 'node:console';

describe('Auth Endpoints', () => {
  let accessToken = '';
  let accessTokenNoCompany = '';
  let userEmail = '';
  let userEmailNoCompany = '';
  let clientId = '';
  let projectId = '';
  
  // Project Testing
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

  const testProject = {
    clientId: "",
    name: "Project Test",
    projectCode: "PRTest",
    address: {
      street: "Calle de la Test",
      number: "10",
      postal: "28000",
      city: "Madrid",
      province: "Madrid"
    },
    email: "project@test.com",
    active: true
  };

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

    // Create Company data
    res = await request(app)
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testCompany)

    // Create client data
    res = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testClient)
    clientId = res.body.content._id

    // Update the clientId for the project
    testProject.clientId = clientId;
  })

  describe('POST /api/project/', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testProject)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      projectId = res.body.content._id
    });

    it('should refuse user with no company', async () => {
      const res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .send(testProject)
        .expect(409)
    });

    it('should refuse duplicated projectCode', async () => {
      const res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testProject)
        .expect(409)
    });

    it('should refuse incorrect clientid', async () => {
      testProject.projectCode = "blabla"
      testProject.clientId = "69f1f8fb5e811da4fd57ac38"
      const res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testProject)
        .expect(409);
    });

    it('should refuse incorrect data', async () => {
      const res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('GET /api/project', () => {
    it('should get at least one project', async () => {
      const res = await request(app)
        .get(`/api/project?sort=createdAt`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });

    it('should get at least one project with pagination', async () => {
      const res = await request(app)
        .get(`/api/project?page=1&limit=2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('totalItems');
      expect(res.body).toHaveProperty('currentPage');
    });
  });

  describe('PUT /api/project/:id', () => {
    it('should update a project', async () => {
      const res = await request(app)
        .put(`/api/project/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: "newTest"
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      expect(res.body.content.name).toBe("newTest");
    });
  });

  describe('DELETE /api/project/:id?soft=true', () => {
    it('should soft-delete a project', async () => {
      const res = await request(app)
        .delete(`/api/project/${projectId}?soft=true`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });
  });

  describe('GET /api/project/archived', () => {
    it('should get at least one archived project', async () => {
      const res = await request(app)
        .get(`/api/project/archived`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });
  });

  describe('GET /api/project/:id', () => {
    it('should return no project', async () => {
      const res = await request(app)
        .get(`/api/project/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /api/project/:id/restore', () => {
    it('should restore the project', async () => {
      const res = await request(app)
        .patch(`/api/project/${projectId}/restore`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('GET /api/project/:id', () => {
    it('should find the project', async () => {
      const res = await request(app)
        .get(`/api/project/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should not find the project if no user company', async () => {
      const res = await request(app)
        .get(`/api/project/${projectId}`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .expect(409);
    });
  });

  // Clean after testing
  afterAll(async () => {
    // Delete project
    if(projectId) {
      await request(app)
        .delete(`/api/project/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
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
    // Delete user no company
    if (userEmailNoCompany) {
      await request(app)
        .delete(`/api/user`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`);
    }
  });
});