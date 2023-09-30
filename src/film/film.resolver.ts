import { Resolver, Query, ID, Args } from '@nestjs/graphql'
import { FilmService } from './film.service'
import { FilmInformationPublic, PaginatedFilm } from './dtos'
import { PaginationArgs } from '@/common/interface'

@Resolver()
export class FilmResolver {
  constructor(private readonly filmService: FilmService) {}

  @Query(() => FilmInformationPublic)
  async getFilmById(@Args('id', { type: () => ID }) id: number): Promise<FilmInformationPublic> {
    return this.filmService.getFilmById(id)
  }

  @Query(() => PaginatedFilm)
  async getFilms(@Args() pagination: PaginationArgs): Promise<PaginatedFilm> {
    return this.filmService.getFilms(pagination)
  }
}
