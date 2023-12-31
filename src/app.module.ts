import { Module } from '@nestjs/common';

import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
import { AppFilter, AppIntercepter, AppPipe } from './modules/core/providers';
import { DatabaseModule } from './modules/database/database.module';
import { ExampleModule } from './modules/example/example.module';

@Module({
    imports: [
        ContentModule,
        ExampleModule,
        CoffeesModule,
        CoreModule.forRoot(),
        DatabaseModule.forRoot(database),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new AppPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        },
    ],
})
export class AppModule {}
