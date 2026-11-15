import type { MigrationInterface, QueryRunner } from "typeorm";

/** Création des tables projets et experiences. */
export class Init1763200000000 implements MigrationInterface {
  name = "Init1763200000000";

  async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await q.query(`
      CREATE TABLE "projets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "slug" varchar NOT NULL UNIQUE,
        "ordre" int NOT NULL DEFAULT 0,
        "publie" boolean NOT NULL DEFAULT true,
        "nom" varchar NOT NULL,
        "type" varchar NOT NULL,
        "annee" varchar,
        "categories" text[] NOT NULL DEFAULT '{}',
        "description" text NOT NULL,
        "role" text NOT NULL,
        "technologies" jsonb NOT NULL DEFAULT '[]',
        "visuel" jsonb NOT NULL DEFAULT '{"type":"vide"}',
        "etude" jsonb NOT NULL DEFAULT '{}',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )`);
    await q.query(`
      CREATE TABLE "experiences" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "ordre" int NOT NULL DEFAULT 0,
        "publie" boolean NOT NULL DEFAULT true,
        "periode" varchar NOT NULL,
        "poste" varchar NOT NULL,
        "structure" varchar NOT NULL,
        "description" text NOT NULL,
        "technos" text[] NOT NULL DEFAULT '{}',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )`);
    await q.query(`CREATE INDEX "projets_ordre_idx" ON "projets" ("ordre")`);
    await q.query(`CREATE INDEX "experiences_ordre_idx" ON "experiences" ("ordre")`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE "experiences"`);
    await q.query(`DROP TABLE "projets"`);
  }
}
