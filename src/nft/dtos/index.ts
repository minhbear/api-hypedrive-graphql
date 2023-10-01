import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType({ isAbstract: true })
export class CreateCompressedNFTMetadata {
  @Field(() => ID)
  @IsNotEmpty()
  filmId: number

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
export class CompressedNFTMetadata {
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