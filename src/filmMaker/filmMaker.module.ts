import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { FilmMakerResolver } from './filmMaker.resolver'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schemaFilmMaker.gql',
      path: `/filmMaker/graphql`,
      formatError: (error: GraphQLError) => {
        const errorFormatted = {
          //@ts-ignore
          statusCode: error.extensions?.exception?.status || 500,
          //@ts-ignore
          message: error.extensions?.exception?.response?.message || error.message,
          //@ts-ignore
          messageCode: error.extensions?.exception?.messageCode || error.message
        }

        return errorFormatted
      },
      include: [FilmMakerResolver]
    }),

    /* Resolvers module */
    FilmMakerResolver
  ]
})
export class FilmMakerModule {}
