import { NFTService } from './nft.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReturnMessageBase } from '@/common/interface/returnBase';
import { AuthKylan } from '@/common/decorators/auth.decorator';
import { ROLE } from '@/common/constant';
import { CreateCompressedNFTMetadata } from './dtos';
import { Person } from '@/common/decorators/person.decorator';
import { PersonEntity } from '@/db/entities/person';

@Resolver()
export class NFTResolver {
  constructor(
    private readonly nftService: NFTService
  ){}

  @AuthKylan([ROLE.FILMMAKER])
  @Mutation(() => ReturnMessageBase)
  async createCompressedNFTMetadata(@Args('input') input: CreateCompressedNFTMetadata, @Person() person: PersonEntity) {
    return await this.nftService.createCompressNFTMetadata(input, person)
  }
}
