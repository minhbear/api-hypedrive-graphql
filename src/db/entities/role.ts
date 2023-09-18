import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Role } from 'src/common/constant'

@Entity('role')
@ObjectType({ isAbstract: true })
export class RoleEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number

  @Field(() => Role)
  @Column()
  role: Role
}