import { FilmEntity } from '@/db/entities/film'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GetFilmCommand } from './commands/GetFilm.command'
import { plainToClass } from 'class-transformer'
import { FilmInformationPublic, PaginatedFilm } from './dtos'
import { PaginationArgs } from '@/common/interface'
import { paginate } from '@/common/paginate'

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>
  ) {}

  async getFilmById(id: number): Promise<FilmInformationPublic> {
    return plainToClass(FilmEntity, await GetFilmCommand.getFilmById(id), {
      excludeExtraneousValues: true
    }) as FilmInformationPublic
  }

  async getFilms(paginationArgs: PaginationArgs): Promise<PaginatedFilm> {
    const query = this.filmRepository.createQueryBuilder().select()

    return paginate({ query, paginationArgs, isUsedPlainClass: true, classRef: FilmEntity, defaultLimit: 7 })
  }
}
