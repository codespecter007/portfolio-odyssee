import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { configurer } from "./bootstrap";
import { config } from "./config";

async function demarrer() {
  // En local, lit le fichier .env s’il existe ; en production, Docker fournit les variables.
  try {
    process.loadEnvFile();
  } catch {
    /* pas de fichier .env */
  }
  const conf = config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Derrière Caddy : l’adresse IP réelle du visiteur vient de l’en-tête X-Forwarded-For.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  configurer(app, conf.uploadDir);
  await app.listen(conf.port, "0.0.0.0");
  new Logger("API").log(`Prête sur le port ${conf.port}`);
}

void demarrer();
