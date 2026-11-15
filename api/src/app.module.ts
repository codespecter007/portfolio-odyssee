import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth/auth.controller";
import { AdminGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { RevalidationService } from "./common/revalidation.service";
import { type Config, config } from "./config";
import { optionsBase } from "./data-source";
import { Experience } from "./entities/experience.entity";
import { Projet } from "./entities/projet.entity";
import {
  AdminExperiencesController,
  ExperiencesController,
} from "./experiences/experiences.controller";
import { ExperiencesService } from "./experiences/experiences.service";
import { HealthController } from "./health/health.controller";
import { MetricsController, MetricsMiddleware } from "./metrics/metrics";
import { AdminProjetsController, ProjetsController } from "./projets/projets.controller";
import { ProjetsService } from "./projets/projets.service";
import { UploadsController } from "./uploads/uploads.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService<Config, true>) => optionsBase(c.get("databaseUrl", { infer: true })),
    }),
    TypeOrmModule.forFeature([Projet, Experience]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (c: ConfigService<Config, true>) => ({
        secret: c.get("jwtSecret", { infer: true }),
        signOptions: { expiresIn: "8h" },
      }),
    }),
    // Limite générale : 120 requêtes par minute et par adresse IP.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
  ],
  controllers: [
    AuthController,
    ProjetsController,
    AdminProjetsController,
    ExperiencesController,
    AdminExperiencesController,
    UploadsController,
    HealthController,
    MetricsController,
  ],
  providers: [
    AuthService,
    AdminGuard,
    ProjetsService,
    ExperiencesService,
    RevalidationService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes("*");
  }
}
