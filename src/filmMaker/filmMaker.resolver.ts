import { Args, ID, Query, Resolver } from '@nestjs/graphql'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'

@Resolver(PersonEntity)
export class FilmMakerResolver {
  constructor(private readonly filmMakerService: FilmMakerService) {}

  @Query(() => String)
  helloFilmMaker() {
    return 'hello'
  }

  @Query(() => PersonEntity)
  async getFilmMaker(@Args('id', { type: () => ID }) id: number): Promise<PersonEntity> {
    return await this.filmMakerService.findOne(id)
  }
}
