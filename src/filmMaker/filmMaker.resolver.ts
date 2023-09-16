import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class FilmMakerResolver {
  @Query(() => String)
  helloFilmaker() {
    return 'hello'
  }
}
