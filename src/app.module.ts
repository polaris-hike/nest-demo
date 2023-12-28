import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
import { ExampleModule } from './modules/example/example.module';

@Module({
    imports: [
        ContentModule,
        ExampleModule,
        CoffeesModule,
        CoreModule.forRoot({
            config: {
                name: '3R教室1',
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
