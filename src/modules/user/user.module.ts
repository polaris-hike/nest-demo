// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { Configure } from '../config/configure';

import { DatabaseModule } from '../database/database.module';

import { addEntities } from '../database/helpers';

import * as entities from './entities';
import * as guards from './guards';
import * as repositories from './repositories';
import * as services from './services';
import * as strategies from './strategies';

@Module({})
export class UserModule {
    static async forRoot(configure: Configure) {
        return {
            module: UserModule,
            imports: [
                PassportModule,
                services.AuthService.jwtModuleFactory(configure),
                addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            providers: [
                ...Object.values(services),
                // ...(await addSubscribers(configure, Object.values(subscribers))),
                ...Object.values(strategies),
                ...Object.values(guards),
            ],
            exports: [
                ...Object.values(services),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
        };
    }
}
