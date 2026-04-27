// src/docs/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Final Practise API - Express with Swagger',
      version: '1.0.0',
      description: 'API REST documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name', 'lastname', 'nif', 'address'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            name: { type: 'string', example: 'Emilie' },
            lastname: { type: 'string', example: 'Dubief' },
            nif: { type: 'string', example: 'ABC123' },
            role: { type: 'string', enum: ['admin', 'guest'], default: 'admin' },
            status: { type: 'string', enum: ['pending', 'verified'], default: 'pending' },
            verificationCode: { type: 'string', default: 'Random 6 digits code' },
            verificationAttempts: { type: 'number', default: 3 },
            company: { $ref: '#/components/schemas/Company' },
            address: { $ref: '#/components/schemas/Address' },
          }
        },
        UserVisible: {
          type: 'object',
          required: ['email', 'status', 'role'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            status: { type: 'string', enum: ['pending', 'verified'], default: 'pending' },
            role: { type: 'string', enum: ['admin', 'guest'], default: 'admin' },
          }
        },
        Company: {
          type: 'object',
          required: ['owner', 'name', 'cif', 'address', 'isFreelance'],
          properties: {
            owner: { $ref: '#/components/schemas/User' },
            name: { type: 'string', example: 'Google' },
            cif: { type: 'string', example: 'ABC123' },
            address: {type: 'ref: Address'},
            logo: {type: 'string'},
            isFreelance: {type: 'boolean'}
          }
        },
        Address: {
          type: 'object',
          required: ['street', 'number', 'postal', 'city', 'province'],
          properties: {
            street: { type: 'string', example: 'Calle de Galileo' },
            number: { type: 'string', example: '10' },
            postal: { type: 'string', example: '28000' },
            city: { type: 'string', example: 'Madrid' },
            province: { type: 'string', example: 'Madrid' },
          }
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export default swaggerJsdoc(options);