import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PuppyModule } from "./infrastructure/puppy/puppy.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { CalendarModule } from "./infrastructure/calendar/calendar.module";
import { ConfigurationModule } from "./infrastructure/config/config.module";
import { TrainingModule } from "./infrastructure/training/training.module";
import { AIModule } from "./infrastructure/ai/ai.module";
import { AnalyticsModule } from "./infrastructure/analytics/analytics.module";

@Module({
  imports: [
    ConfigurationModule,
    AuthModule,
    PuppyModule,
    CalendarModule,
    TrainingModule,
    AIModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
