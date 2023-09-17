import { Module } from '@nestjs/common'
import { FilmMakerModule } from './filmMaker/filmMaker.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as _ from 'lodash'
import { configData } from './db/ormconfig'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PersonModule } from './person/person.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      path: `/graphql`,
      formatError: (error: GraphQLError) => {
        const message = _.isArray(error.message) ? error.message : [error.message]

        const errorFormatted = {
          //@ts-ignore
          statusCode: error.extensions?.originalError?.statusCode || 500,
          //@ts-ignore
          message: error.extensions?.originalError?.message || message,
          //@ts-ignore
          messageCode: error.extensions?.code || error.message
        }

        return errorFormatted
      },
      include: [FilmMakerModule, AuthModule]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`
    }),
    FilmMakerModule,
    AuthModule,
    PersonModule,
    TypeOrmModule.forRoot(configData)
  ],
  providers: []
})
export class AppModule {}
