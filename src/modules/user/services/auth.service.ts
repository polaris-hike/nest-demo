import { ForbiddenException, Injectable } from '@nestjs/common';

import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { decrypt } from 'dotenv';

import { ExtractJwt } from 'passport-jwt';

import { Configure } from '@/modules/config/configure';
import { getTime } from '@/modules/core/helpers';

import { UpdatePasswordDto } from '../dtos/account.dto';
import { RegisterDto } from '../dtos/auth.dto';

import { UserEntity } from '../entities/user.entity';

import { defaultUserConfig } from '../helpers';
import { UserRepository } from '../repositories/user.repository';
import { UserConfig } from '../types';

import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
        protected configure: Configure,
        protected userService: UserService,
        protected tokenService: TokenService,
        protected userRepository: UserRepository,
    ) {}

    async validateUser(credential: string, password: string) {
        const user = await this.userService.findOneByCredential(credential, async (query) =>
            query.addSelect('user.password'),
        );
        if (user && decrypt(password, user.password)) {
            return user;
        }
        return false;
    }

    async login(user: UserEntity) {
        const now = await getTime(this.configure);
        const { accessToken } = await this.tokenService.generateAccessToken(user, now);
        return accessToken.value;
    }

    async logout(req: Request) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
        if (accessToken) {
            await this.tokenService.removeAccessToken(accessToken);
        }

        return {
            msg: 'logout_success',
        };
    }

    async createToken(id: string) {
        const now = await getTime(this.configure);
        let user: UserEntity;
        try {
            user = await this.userService.detail(id);
        } catch (error) {
            throw new ForbiddenException();
        }
        const { accessToken } = await this.tokenService.generateAccessToken(user, now);
        return accessToken.value;
    }

    async register(data: RegisterDto) {
        const { username, nickname, password } = data;
        const user = await this.userService.create({
            username,
            nickname,
            password,
            actived: true,
        } as any);
        return this.userService.findOneByCondition({ id: user.id });
    }

    async updatePassword(user: UserEntity, { password, oldPassword }: UpdatePasswordDto) {
        const item = await this.userRepository.findOneOrFail({
            select: ['password'],
            where: { id: user.id },
        });
        if (decrypt(item.password, oldPassword))
            throw new ForbiddenException('old password not matched');
        item.password = password;
        await this.userRepository.save(item);
        return this.userService.findOneByCondition({ id: item.id });
    }

    static jwtModuleFactory(configure: Configure) {
        return JwtModule.registerAsync({
            useFactory: async (): Promise<JwtModuleOptions> => {
                const config = await configure.get<UserConfig>(
                    'user',
                    defaultUserConfig(configure),
                );
                const option: JwtModuleOptions = {
                    secret: config.jwt.secret,
                    verifyOptions: {
                        ignoreExpiration: !configure.env.isProd(),
                    },
                };
                if (configure.env.isProd())
                    option.signOptions.expiresIn = `${config.jwt.token_expired}s`;
                return option;
            },
        });
    }
}
