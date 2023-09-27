import { Resolver, Query, ID, Args } from '@nestjs/graphql'
import { FilmService } from './film.service'
import { FilmInformationPublic } from './dtos'

@Resolver()
export class FilmResolver {
  constructor(private readonly filmService: FilmService) {}

  @Query(() => FilmInformationPublic)
  async getFilmById(@Args('id', { type: () => ID }) id: number): Promise<FilmInformationPublic> {
    return this.filmService.getFilmById(id)
  }
}
