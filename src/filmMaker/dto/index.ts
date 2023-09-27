import { FILM_GENRE } from '@/common/constant'
import { FilmTopCast } from '@/common/types'
import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType({ isAbstract: true })
export class CollectionMetadataDto {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  symbol: string

  @Field()
  @IsNotEmpty()
  uri: string
}

@InputType({ isAbstract: true })
export class CompressedNFTMetadataDto {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  symbol: string

  @Field()
  @IsNotEmpty()
  uri: string
}

@InputType({ isAbstract: true })
export class CreateCollectionNFTDto {
  @Field()
  @IsNotEmpty()
  filmId: number

  @Field(() => CollectionMetadataDto)
  @IsNotEmpty()
  metadata: CollectionMetadataDto
}

export class CreateCompressedNFTMetadataDto {
  @Field()
  @IsNotEmpty()
  filmId: number

  @Field(() => CompressedNFTMetadataDto)
  @IsNotEmpty()
  metadata: CompressedNFTMetadataDto
}

@InputType({ isAbstract: true })
export class CreateFilmDto {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  description: string

  @Field(() => Int)
  @IsNotEmpty()
  duration: number

  @Field()
  @IsNotEmpty()
  releaseDate: string

  @Field(() => [FILM_GENRE], { defaultValue: [] })
  @IsNotEmpty()
  genres: FILM_GENRE[]

  @Field(() => [String], { defaultValue: [] })
  @IsNotEmpty()
  stars: string[]

  @Field(() => [String], { defaultValue: [] })
  @IsNotEmpty()
  directors: string[]

  @Field(() => [FilmTopCast], { defaultValue: [] })
  @IsNotEmpty()
  topCasts: FilmTopCast[]

  @Field(() => GraphQLISODateTime)
  @IsNotEmpty()
  endDateSubscriber: Date
}
