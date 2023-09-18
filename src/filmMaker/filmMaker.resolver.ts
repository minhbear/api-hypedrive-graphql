import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { Role } from 'src/common/constant'
import { PersonService } from 'src/person/person.service'

@Resolver(PersonEntity)
export class FilmMakerResolver {
  constructor(private readonly filmMakerService: FilmMakerService, private readonly personService: PersonService) {}

  @Query(() => String)
  helloFilmMaker() {
    return 'hello'
  }

  @Query(() => PersonEntity)
  async getFilmMaker(@Args('id', { type: () => ID }) id: number): Promise<PersonEntity> {
    return await this.filmMakerService.findOne(id)
  }

  @ResolveField(() => Role)
  async role(@Parent() person: PersonEntity): Promise<Role> {
    await this.personService.findById(person.id)

    return (await this.personService.findById(person.id, ['rolePerson'])).rolePerson.role
  }
}
