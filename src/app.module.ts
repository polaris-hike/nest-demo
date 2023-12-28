import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
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
    providers: [AppService],
})
export class AppModule {}
