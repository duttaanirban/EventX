import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'EventX API',
      version: '1.0.0',
      description: 'Smart event ticketing, payments, QR check-in, and analytics API'
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a user',
          responses: { 201: { description: 'Registered' } }
        }
      },
      '/auth/login': {
        post: { tags: ['Auth'], summary: 'Login', responses: { 200: { description: 'Logged in' } } }
      },
      '/events': {
        get: { tags: ['Events'], summary: 'List events', responses: { 200: { description: 'Events' } } },
        post: { tags: ['Events'], security: [{ bearerAuth: [] }], summary: 'Create event', responses: { 201: { description: 'Created' } } }
      },
      '/events/{id}': {
        get: { tags: ['Events'], summary: 'Get event', responses: { 200: { description: 'Event' } } },
        put: { tags: ['Events'], security: [{ bearerAuth: [] }], summary: 'Update event', responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Events'], security: [{ bearerAuth: [] }], summary: 'Delete event', responses: { 200: { description: 'Deleted' } } }
      },
      '/payments/create-order': {
        post: { tags: ['Payments'], security: [{ bearerAuth: [] }], summary: 'Create Razorpay order', responses: { 201: { description: 'Order created' } } }
      },
      '/payments/verify': {
        post: { tags: ['Payments'], security: [{ bearerAuth: [] }], summary: 'Verify Razorpay payment', responses: { 200: { description: 'Payment verified' } } }
      },
      '/qr/validate': {
        post: { tags: ['QR'], security: [{ bearerAuth: [] }], summary: 'Validate QR check-in', responses: { 200: { description: 'Checked in' } } }
      }
    }
  },
  apis: []
});
