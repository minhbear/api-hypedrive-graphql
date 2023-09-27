import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bs58 from 'bs58'
import { PersonEntity } from 'src/db/entities/person'
import { CreateCollectionNFTDto, CreateCompressedNFTMetadataDto, CreateFilmDto } from './dto'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { NFTService } from '@/nft/nft.service'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { config } from '@/config'
import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { FilmEntity } from '@/db/entities/film'
import { GetFilmCommand } from '@/film/commands/GetFilm.command'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { ADMIN_PROCESS_STATUS, FILM_STATUS } from '@/common/constant'

@Injectable()
export class FilmMakerService {
  constructor(
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>,
    @InjectRepository(FilmCollectionNFTEntity)
    private filmCollectionNFTRepository: Repository<FilmCollectionNFTEntity>,
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @InjectRepository(FilmCompressedNFTEntity)
    private filmCompressedNFTRepository: Repository<FilmCompressedNFTEntity>,
    private nftService: NFTService
  ) {}

  async findOne(id: number): Promise<PersonEntity> {
    return await this.personRepository.findOneOrFail({ where: { id } })
  }

  async createCollection(input: CreateCollectionNFTDto, person: PersonEntity): Promise<ReturnMessageBase> {
    if (!person.publicKey) {
      throw new BadRequestException(`FilmMaker needed provide publickey`)
    }

    const { name, symbol, uri } = input.metadata

    const film = await GetFilmCommand.getByFilmIdAndPersonId(input.filmId, person.id)

    const adminKeypair = Keypair.fromSecretKey(bs58.decode(config.admin.secretKey))

    const { masterEditionAccount, metadataAccount, mint, tokenAccount, treeKeypair } =
      await this.nftService.createCollection({
        adminKeypair,
        collectionMetadataDto: input.metadata,
        connection: new Connection(config.rpcUrl, 'confirmed'),
        filmMakerPubKey: new PublicKey(person.publicKey)
      })

    await this.filmCollectionNFTRepository.save({
      film,
      name,
      symbol,
      uri,
      masterEditionAccount: masterEditionAccount.toBase58(),
      metadataAccount: metadataAccount.toBase58(),
      mint: mint.toBase58(),
      tokenAccount: tokenAccount.toBase58(),
      treeKeypair: treeKeypair.toBase58()
    } as FilmCollectionNFTEntity)

    return {
      message: `Create collection NFT for film success`,
      success: true
    }
  }

  async createCompressedNFTMetadata(
    input: CreateCompressedNFTMetadataDto,
    person: PersonEntity
  ): Promise<ReturnMessageBase> {
    const { name, symbol, uri } = input.metadata
    const film = await GetFilmCommand.getByFilmIdAndPersonId(input.filmId, person.id)

    await this.filmCompressedNFTRepository.save({
      film,
      name,
      symbol,
      uri
    } as FilmCompressedNFTEntity)

    return {
      message: `Create compressed NFT metadata for film success`,
      success: true
    }
  }

  async createFilm(input: CreateFilmDto, person: PersonEntity): Promise<ReturnMessageBase> {
    // Minh-27-9-2023: we add admin status approved by default to skip the step approval by admin. This status need to update bu admin
    const film = await this.filmRepository.save({
      ...input,
      person,
      status: FILM_STATUS.COMING_SOON,
      adminProcess: ADMIN_PROCESS_STATUS.APPROVED
    } as FilmEntity)

    console.log(film)

    return {
      message: `Create film success`,
      success: true
    }
  }
}
