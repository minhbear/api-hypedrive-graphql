import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { ROLE } from 'src/common/constant'
import { ROLES_KEY } from 'src/common/decorators/roles.decorator'

export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const requiredRoles = this._reflector.get<ROLE>(ROLES_KEY, context.getHandler())

    // if(!requiredRoles) {
    //   return true
    // }

    const ctx = GqlExecutionContext.create(context)

    const {
      req: { user }
    } = ctx.getContext()
    console.log('Role Guard >>>>>', user)

    return true
  }
}
