import { DynamicModule } from '@nestjs/common';

import { ConfigService } from './services/config.service';

export class CoreModule {
    static forRoot(options: { config: RecordAny }): DynamicModule {
        return {
            module: CoreModule,
            global: true,
            providers: [
                {
                    provide: ConfigService,
                    useFactory() {
                        return new ConfigService(options.config);
                    },
                },
            ],
            exports: [ConfigService],
        };
    }
}
