require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const connection = process.env.DATABASE_URL
  ? { url: process.env.DATABASE_URL }
  : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    };

const useSsl = Boolean(process.env.DATABASE_URL) || env === 'production';

const shared = {
  ...connection,
  dialect: 'postgres',
  logging: env === 'development' ? console.log : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  ...(useSsl && {
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  })
};

module.exports = {
  development: shared,
  test: shared,
  production: shared
};
