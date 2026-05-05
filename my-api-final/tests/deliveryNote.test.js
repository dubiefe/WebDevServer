// tests/deliveryNote.test.js
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
  let deliveryNoteId = '';
  let deliveryNoteSignedId = '';
  
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

  const testDelieveryNote = {
    project: "",
    format: "hours",
    description: "Test delivery note",
    workDate: "2026-05-04T00:00:00.000Z",
    hours: 7.5
  };

  const testDelieveryNoteSigned = {
    project: "",
    format: "material",
    description: "Test delivery note",
    workDate: "2026-05-04T00:00:00.000Z",
    material: "cement",
    quantity: 45,
    unit: "kg"
  };

  beforeAll(async () => {
    // Register users
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

    // Create project data
    res = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testProject)
    projectId = res.body.content._id

    // Update the projectId for the deliveryNote
    testDelieveryNote.project = projectId;
    testDelieveryNoteSigned.project = projectId;
  })

  describe('POST /api/deliverynote/', () => {
    it('should create a new delievery note', async () => {
      const res = await request(app)
        .post('/api/deliverynote')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testDelieveryNote)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      deliveryNoteId = res.body.content._id
    });

    it('should create a new delievery note', async () => {
      const res = await request(app)
        .post('/api/deliverynote')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testDelieveryNoteSigned)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      deliveryNoteSignedId = res.body.content._id
    });

    it('should refuse adding delivery note if no company linked to the user', async () => {
      const res = await request(app)
        .post('/api/deliverynote')
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .send(testDelieveryNote)
        .expect(409)
    });

    it('should refuse incorrect data', async () => {
      const res = await request(app)
        .post('/api/deliverynote')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('GET /api/delievrynote', () => {
    it('should get at least one delievry note', async () => {
      const res = await request(app)
        .get(`/api/deliverynote?sort=createdAt`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
    });

    it('should get at least one delivery note with pagination', async () => {
      const res = await request(app)
        .get(`/api/deliverynote?page=1&limit=2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('totalItems');
      expect(res.body).toHaveProperty('currentPage');
    });
  });

  describe('GET /api/deliverynote/:id', () => {
    it('should find the delivery note', async () => {
      const res = await request(app)
        .get(`/api/deliverynote/${deliveryNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should not find the delivery note because user not in company', async () => {
      const res = await request(app)
        .get(`/api/deliverynote/${deliveryNoteId}`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .expect(409);
    });

    it('should not find the delivery note', async () => {
      const res = await request(app)
        .get(`/api/deliverynote/69f1f8fb5e811da4fd57ac38`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /api/deliverynote/pdf/:id', () => {
    it('should download the delivery note PDF', async () => {
      const res = await request(app)
        .get(`/api/deliverynote/pdf/${deliveryNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/pdf')
        .expect(200);
    });

    it('should not download the delivery note PDF if not in company', async () => {
      const res = await request(app)
        .get(`/api/deliverynote/pdf/${deliveryNoteId}`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .expect(409);
    });
  });

  describe('PATCH /api/deliverynote/:id/sign', () => {
    it('should sign the delivery note', async () => {
      const res = await request(app)
        .patch(`/api/deliverynote/${deliveryNoteSignedId}/sign`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X6QAAAABJRU5ErkJggg==" })
        .expect('Content-Type', 'application/pdf')
        .expect(200);
    });

    it('should not sign a delivery note already sign', async () => {
      const res = await request(app)
        .patch(`/api/deliverynote/${deliveryNoteSignedId}/sign`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X6QAAAABJRU5ErkJggg==" })
        .expect(409);
    });

    it('should not sign a delivery note if user not in company', async () => {
      const res = await request(app)
        .patch(`/api/deliverynote/${deliveryNoteSignedId}/sign`)
        .set('Authorization', `Bearer ${accessTokenNoCompany}`)
        .send({ "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X6QAAAABJRU5ErkJggg==" })
        .expect(409);
    });

    it('should refuse incorrect data', async () => {
      const res = await request(app)
        .patch(`/api/deliverynote/${deliveryNoteSignedId}/sign`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('PATCH /api/deliverynote/:id/sign', () => {
    it('should not deleted a signed delivery note', async () => {
    const res = await request(app)
        .delete(`/api/deliverynote/${deliveryNoteSignedId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(409);
    });
  });

  // Clean after testing
  afterAll(async () => {
    // Delete delivery note
    if(deliveryNoteId) {
      await request(app)
        .delete(`/api/deliverynote/${deliveryNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
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