import { PersonEntity } from '@/db/entities/person';
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity])],
  providers: [UserModule, UserService]
})
export class UserModule {

}