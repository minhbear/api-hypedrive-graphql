import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { ROLE } from 'src/common/constant'
import { PersonService } from 'src/person/person.service'

// @Auth([ROLE.FILMMAKER])
@Resolver(PersonEntity)
export class FilmMakerResolver {
  constructor(private readonly filmMakerService: FilmMakerService, private readonly personService: PersonService) {}

  @Query(() => String)
  helloFilmMaker() {
    return 'hello'
  }

  @Query(() => PersonEntity, { name: 'getFilmMakerById' })
  async getFilmMakerById(@Args('id', { type: () => ID }) id: number): Promise<PersonEntity> {
    return await this.filmMakerService.findOne(id)
  }

  @ResolveField(() => ROLE)
  async role(@Parent() person: PersonEntity): Promise<ROLE> {
    await this.personService.findById(person.id)

    return (await this.personService.findById(person.id, ['rolePerson'])).rolePerson.role
  }
}
