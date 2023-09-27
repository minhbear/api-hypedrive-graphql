import { Field, ID } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { FilmEntity } from './film'

@Entity('film-collection-nft')
export class FilmCollectionNFTEntity {
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  mint?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  tokenAccount?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  metadataAccount?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  masterEditionAccount?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  treeKeypair?: string | null

  @OneToOne(() => FilmEntity)
  @JoinColumn()
  film: FilmEntity
}
