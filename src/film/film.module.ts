import { FilmEntity } from '@/db/entities/film'
import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { FilmEventEntity } from '@/db/entities/filmEvent'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmResolver } from './film.resolver'
import { FilmService } from './film.service'

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, FilmEventEntity, FilmCollectionNFTEntity])],
  providers: [FilmResolver, FilmService],
  exports: [FilmService]
})
export class FilmModule {}
