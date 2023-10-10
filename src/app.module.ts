import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './modules/content/content.module';
import { ExampleModule } from './modules/example/example.module';

@Module({
    imports: [ContentModule, ExampleModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
