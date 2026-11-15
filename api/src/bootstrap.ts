import { ValidationPipe, type INestApplication } from "@nestjs/common";
import cookieParser from "cookie-parser";
import express from "express";
import { resolve } from "node:path";

/** Réglages communs à l’application et aux tests de bout en bout. */
export function configurer(app: INestApplication, uploadDir: string) {
  app.setGlobalPrefix("api", { exclude: ["health", "metrics"] });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  // Images envoyées depuis l’admin, servies telles quelles et mises en cache longtemps.
  app.use("/uploads", express.static(resolve(uploadDir), { maxAge: "30d", immutable: true }));
  app.enableShutdownHooks();
}
