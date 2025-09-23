require('dotenv').config();

module.exports = {
  app: {
    port: parseInt(process.env.PORT || '4000', 10),
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
    accessExpiration: '1h',
    refreshExpiration: '7d'
  }

};

function buildMongoUri() {
  const credentials = `${encodeURIComponent(process.env.MONGODB_USER)}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}`;
  const server = process.env.MONGODB_SERVER;
  const dbName = process.env.MONGODB_DB || 'simad-portal-dev-db';
  // return 'mongodb://127.0.0.1:27017/simad_portal_api?directConnection=true&serverSelectionTimeoutMS=2000';
  return 'mongodb+srv://abdi:abdi123@myfirstcluster.8edhtqd.mongodb.net/simad-portal-dev-db?retryWrites=true&w=majority&appName=Cluster0'
  // return `mongodb://${credentials}@${server}/${dbName}?authSource=${process.env.MONGODB_AUTH_SOURCE || 'admin'}`;
}
