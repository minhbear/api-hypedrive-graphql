import { DataSourceOptions, DataSource } from 'typeorm'
import { config } from '../config'

const { databaseName, databaseDev, password, port, user } = config.db

export const configData: DataSourceOptions = {
  type: 'postgres',
  host: databaseDev,
  port: parseInt(port as string),
  username: user,
  password,
  database: databaseName,
  // After development turn off this synchronization
  synchronize: true,
  logging: false,
  entities: ['dist/db/entities/*.js']
}

export default new DataSource(configData)
