import { registerEnumType } from '@nestjs/graphql'
import { Role } from '../../common/constant'

registerEnumType(Role, { name: 'Role' })