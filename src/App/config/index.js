require('dotenv').config();

module.exports = {
  app: {
    port: parseInt(process.env.APP_PORT || '4001', 10),
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: buildMongoUri(),
    options: {
      authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    accessExpiration: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiration: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  }

};

function buildMongoUri() {
  const credentials = `${encodeURIComponent(process.env.MONGODB_USER)}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}`;
  const server = process.env.MONGODB_SERVER;
  const dbName = process.env.MONGODB_DB || 'simad-portal-dev-db';
   
   return `mongodb://${credentials}@${server}/${dbName}?authSource=${process.env.MONGODB_AUTH_SOURCE || 'admin'}`;
}
