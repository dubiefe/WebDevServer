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
        Client: {
          type: 'object',
          required: ['user', 'company', 'name', 'cif', 'email', 'address'],
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            company: { $ref: '#/components/schemas/Company' },
            name: { type: 'string', example: 'Google' },
            cif: { type: 'string', example: 'ABC123' },
            email: { type: 'string', format: 'email', example: 'google@example.com' },
            phone: { type: 'string', example: '+34 790 98 78 56' },
            address: { $ref: '#/components/schemas/Address' }
          }
        },
        Project: {
          type: 'object',
          required: ['user', 'company', 'client', 'name', 'projectCode', 'address', 'email'],
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            company: { $ref: '#/components/schemas/Company' },
            client: { $ref: '#/components/schemas/Client' },
            name: { type: 'string', example: 'Company API' },
            projectCode: { type: 'string', example: 'PRJ-2026-001' },
            address: { $ref: '#/components/schemas/Address' },
            email: { type: 'string', format: 'email', example: 'project@company.com' },
            notes: { type: 'string', example: 'Important API for the company' },
            active: { type: 'boolean', example: true }
          }
        },
        DeliveryNote: {
          type: 'object',
          required: ['user', 'company', 'client', 'project', 'description'],
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            company: { $ref: '#/components/schemas/Company' },
            client: { $ref: '#/components/schemas/Client' },
            project: { $ref: '#/components/schemas/Project' },
            format: { type: 'string', enum: ['material', 'hours'] },
            description: { type: 'string', example: 'Material delivery' },
            workDate: { type: 'string', format: 'date-time' },
            // Format material
            material: { type: 'string', example: 'Cement' },
            quantity: { type: 'number', example: 10 },
            unit: { type: 'string', example: 'kg' },
            // Format hours
            hours: { type: 'number', example: 8 },
            workers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'hours'],
                properties: {
                  name: { type: 'string', example: 'Emilie Dubief' },
                  hours: { type: 'number', example: 4 }
                }
              }
            },

            signed: { type: 'boolean', default: false, example: false },
            signedAt: { type: 'string', format: 'date-time', example: '2026-04-29T12:00:00.000Z' },
            signatureData: { type: 'string', example: 'base64-signature' },
            pdfPath: { type: 'string', example: '/uploads/delivery-note.pdf' }
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