import { UseGuards, applyDecorators } from '@nestjs/common'
import { AccessTokenGuard } from 'src/guards/accessToken.guard'

export function Auth() {
  return applyDecorators(UseGuards(AccessTokenGuard))
}
