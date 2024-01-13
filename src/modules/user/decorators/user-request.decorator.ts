import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';

export const ReqUser = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ClassToPlain<UserEntity>;
});
