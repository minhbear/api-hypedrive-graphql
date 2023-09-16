import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { APILogger } from './config/logger'
import { config } from './config'

async function bootstrap() {
  try {
    const { domain, port } = config

    const app = await NestFactory.create(AppModule, {
      logger: new APILogger()
    })

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.listen(port)

    Logger.log(`🤬  Application is running on: ${await app.getUrl()}`, 'NestJS', false)
    Logger.log(`🚀  Server ready at http://${domain}:${port}`, 'Bootstrap', false)
    Logger.log(`##########################################################`, 'Bootstrap', false)
    Logger.warn(`🚀  Film Maker Server http://${domain}:${port}/superadmin/graphql`, 'Bootstrap', false)
    Logger.log(`##########################################################`, 'Bootstrap', false)
    Logger.log(`🚀  Server is listening on port ${port}`, 'Bootstrap', false)
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
    process.exit()
  }
}
bootstrap()
