import { NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import * as configs from './config';
import { ContentModule } from './modules/content/content.module';
import { CreateOptions } from './modules/core/types';
import { DatabaseModule } from './modules/database/database.module';
import { MeilliModule } from './modules/meilisearch/melli.module';
import { UserModule } from './modules/user/user.module';

export const createOptions: CreateOptions = {
    config: { factories: configs, storage: { enabled: true } },
    modules: async (configure) => [
        DatabaseModule.forRoot(configure),
        MeilliModule.forRoot(configure),
        // RestfulModule.forRoot(configure),
        ContentModule.forRoot(configure),
        UserModule.forRoot(configure),
        // RbacModule.forRoot(configure),
    ],
    commands: () => [],
    // globals: {
    //     guard: RbacGuard,
    // },
    builder: async ({ configure, BootModule }) => {
        const container = await NestFactory.create<NestFastifyApplication>(
            BootModule,
            new FastifyAdapter(),
            {
                cors: true,
                logger: ['error', 'warn'],
            },
        );
        // if (!isNil(await configure.get<ApiConfig>('api', null))) {
        //     const restful = container.get(Restful);
        //     /**
        //      * 判断是否存在metadata模块,存在的话则加载并传入factoryDocs
        //      */
        //     let metadata: () => Promise<Record<string, any>>;
        //     if (existsSync(join(__dirname, 'metadata.js'))) {
        //         metadata = (await import(join(__dirname, 'metadata.js'))).default;
        //     }
        //     if (existsSync(join(__dirname, 'metadata.ts'))) {
        //         metadata = (await import(join(__dirname, 'metadata.ts'))).default;
        //     }
        //     await restful.factoryDocs(container, metadata);
        // }
        return container;
    },
};
