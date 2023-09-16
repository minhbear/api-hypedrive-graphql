import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  domain: process.env.APP_HOST || 'localhost',
  port: process.env.APP_PORT || 3000,
  db: {
    databaseDev: process.env.DB_HOST_DEV || 'localhost',
    databasePro: process.env.DB_HOST_PRO,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'Minh0914121791',
    databaseName: process.env.DB_NAME || 'postgres'
  }
}
