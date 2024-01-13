import { Body, Controller, Get, Patch, SerializeOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { pick } from 'lodash';

import { ReqUser } from '../decorators/user-request.decorator';
import { UpdateAccountDto, UpdatePasswordDto } from '../dtos/account.dto';
import { UserEntity } from '../entities/user.entity';
import { AuthService, UserService } from '../services';

// src/modules/user/controllers/user.controller.ts
@ApiTags('账户操作')
@Controller('account')
@ApiBearerAuth()
export class AccountController {
    constructor(
        protected authService: AuthService,
        protected userService: UserService,
    ) {}

    /**
     * 获取用户个人信息
     * 查询账户信息(只有用户自己才能查询)
     * @param user
     */
    @Get('profile')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async profile(@ReqUser() user: ClassToPlain<UserEntity>) {
        return this.userService.detail(user.id);
    }

    /**
     * 更改账户信息
     * @param user
     * @param data
     */
    @Patch()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async update(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body()
        data: UpdateAccountDto,
    ) {
        return this.userService.update({ id: user.id, ...pick(data, ['username', 'nickname']) });
    }

    /**
     * 更改密码
     * @param user
     * @param data
     */
    @Patch('reset-passowrd')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async resetPassword(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdatePasswordDto,
    ): Promise<UserEntity> {
        return this.authService.updatePassword(user, data);
    }
}
