import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Guest } from '../decorators/guest.decorator';
import { ReqUser } from '../decorators/user-request.decorator';
import { CredentialDto, RegisterDto } from '../dtos/auth.dto';
import { UserEntity } from '../entities/user.entity';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services';

// src/modules/user/controllers/auth.controller.ts
@ApiTags('认证操作')
@Controller('auth')
export class AuthController {
    constructor(protected authService: AuthService) {}

    /**
     * 使用用户名密码注册用户
     * @param data
     */
    @Post('register')
    @Guest()
    async register(
        @Body()
        data: RegisterDto,
    ) {
        return this.authService.register(data);
    }

    /**
     * 用户通过凭证(可以是用户名,邮箱,手机号等)+密码登录
     * @param user
     */
    @Post('login')
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(@ReqUser() user: ClassToPlain<UserEntity>, @Body() _data: CredentialDto) {
        return { token: await this.authService.createToken(user.id) };
    }

    /**
     * 注销登录
     * @param req
     */
    @Post('logout')
    @ApiBearerAuth()
    async logout(@Request() req: any) {
        return this.authService.logout(req);
    }
}
