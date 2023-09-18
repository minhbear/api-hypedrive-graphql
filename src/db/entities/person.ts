import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn
} from 'typeorm'

import * as bcrypt from 'bcrypt'
import { RoleEntity } from './role'

@Entity('person')
@ObjectType({ isAbstract: true })
export class PersonEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  publicKey?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  password?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string | null

  @Field()
  @Column()
  name: string

  // TODO: Pending for design
  // @Column()
  // followers: number

  // @Column()
  // following: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken: string | null

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date

  @OneToOne(() => RoleEntity)
  @JoinColumn()
  rolePerson: RoleEntity

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}
