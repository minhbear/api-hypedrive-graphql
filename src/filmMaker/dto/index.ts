import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'



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

export class CreateCompressedNFTMetadataDto {
  @Field()
  @IsNotEmpty()
  filmId: number

  @Field(() => CompressedNFTMetadataDto)
  @IsNotEmpty()
  metadata: CompressedNFTMetadataDto
}
