import { Paginated } from '@/common/interface'
import { FilmEntity } from '@/db/entities/film'
import { ObjectType, OmitType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export class FilmInformationPublic extends OmitType(FilmEntity, ['whiteList', 'gallery']) {}

@ObjectType({ isAbstract: true })
export class PaginatedFilm extends Paginated(FilmInformationPublic) {}
