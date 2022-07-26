import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role } from '../../collection/user/entities/user.entity';
import { Jwt2faAuthGuard } from './jwt-2fa-auth.guard';

export const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends Jwt2faAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const { user } = context.switchToHttp().getRequest();
      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};
