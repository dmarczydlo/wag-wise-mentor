import { Module, Global } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { SupabaseService } from "./supabase.service";
import supabaseConfig from "./supabase.config";

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [supabaseConfig],
    }),
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class ConfigurationModule {}
