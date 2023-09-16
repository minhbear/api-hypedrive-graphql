import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FilmMakerModule } from './filmMaker/filmMaker.module'
import { TypeOrmModule } from '@nestjs/typeorm'

import { configData } from './db/ormconfig'
@Module({
  imports: [FilmMakerModule, TypeOrmModule.forRoot(configData)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
