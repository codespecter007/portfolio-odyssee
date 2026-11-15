import "reflect-metadata";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { creerDataSource } from "./data-source";
import { Experience } from "./entities/experience.entity";
import { Projet } from "./entities/projet.entity";

/**
 * Remplit une base vide avec le contenu initial du portfolio (dossier seed/).
 * Sans effet si des projets existent déjà : on ne réécrase jamais le travail fait dans l’admin.
 */
async function seed() {
  try {
    process.loadEnvFile();
  } catch {
    /* pas de fichier .env */
  }
  const ds = await creerDataSource().initialize();
  const lire = <T>(f: string): T => JSON.parse(readFileSync(join(__dirname, "..", "seed", f), "utf8"));
  if ((await ds.getRepository(Projet).count()) === 0) {
    await ds.getRepository(Projet).save(lire<Partial<Projet>[]>("projets.json"));
    console.log("Projets importés");
  } else console.log("Projets déjà présents, rien à faire");
  if ((await ds.getRepository(Experience).count()) === 0) {
    await ds.getRepository(Experience).save(lire<Partial<Experience>[]>("experiences.json"));
    console.log("Expériences importées");
  }
  await ds.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
