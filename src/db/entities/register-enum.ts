import { registerEnumType } from '@nestjs/graphql'
import { ROLE } from '../../common/constant'

registerEnumType(ROLE, { name: 'Role' })
