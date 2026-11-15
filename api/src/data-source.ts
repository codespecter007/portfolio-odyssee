import "reflect-metadata";
import { DataSource, type DataSourceOptions } from "typeorm";
import { Experience } from "./entities/experience.entity";
import { Projet } from "./entities/projet.entity";
import { Init1763200000000 } from "./migrations/1763200000000-Init";

/** Options partagées par l’application, le seed et les tests. */
export const optionsBase = (url: string): DataSourceOptions => ({
  type: "postgres",
  url,
  entities: [Projet, Experience],
  migrations: [Init1763200000000],
  migrationsRun: true,
  synchronize: false,
});

export const creerDataSource = (url = process.env.DATABASE_URL ?? "") =>
  new DataSource(optionsBase(url));
