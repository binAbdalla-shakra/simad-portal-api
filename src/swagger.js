// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Name',
            version: '1.0.0',
            description: 'A brief description of your API.',
        },
        servers: [{ url: 'http://localhost:4000', description: 'Development server' }],
    },
    apis: [path.join(__dirname, '/routes/*.js')], // <-- absolute path
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
