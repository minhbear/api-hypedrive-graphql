import { Field, ID } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { FilmEntity } from './film'

@Entity('film-compressed-nft')
export class FilmCompressedNFTEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  symbol: string

  @Field()
  @Column()
  uri: string

  @ManyToOne(() => FilmEntity, (film) => film.compressedNFTs)
  film: FilmEntity
}
