import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcryptjs";
import request from "supertest";
import { DataSource } from "typeorm";

/**
 * Tests de bout en bout sur une vraie base PostgreSQL (DATABASE_URL).
 * La base est vidée au début : ne jamais la lancer sur la base de production.
 */
const MDP = "mot-de-passe-de-test";

describe("API du portfolio", () => {
  let app: INestApplication;
  let cookie: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = "secret-de-test";
    process.env.ADMIN_EMAIL = "admin@exemple.test";
    process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash(MDP, 4);
    process.env.COOKIE_SECURE = "false";
    process.env.UPLOAD_DIR = "/tmp/uploads-test";
    const { AppModule } = await import("../src/app.module");
    const { configurer } = await import("../src/bootstrap");
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    configurer(app, process.env.UPLOAD_DIR);
    await app.init();
    const ds = app.get(DataSource);
    await ds.query('TRUNCATE "projets", "experiences"');
  });

  afterAll(() => app.close());

  const projet = {
    slug: "projet-test",
    nom: "Projet de test",
    type: "Projet personnel",
    annee: "2026",
    categories: ["Web", "DevOps"],
    description: "Une description.",
    role: "Tout.",
    technologies: [{ nom: "Docker", logo: "Docker" }],
    visuel: { type: "vide" },
    etude: { accroche: "un test.", reperes: [], contexte: "Contexte." },
  };

  it("répond sur /health", () =>
    request(app.getHttpServer()).get("/health").expect(200, { statut: "ok" }));

  it("expose des métriques Prometheus", async () => {
    const r = await request(app.getHttpServer()).get("/metrics").expect(200);
    expect(r.text).toContain("process_cpu_seconds_total");
  });

  it("refuse l’admin sans connexion", () =>
    request(app.getHttpServer()).get("/api/admin/projets").expect(401));

  it("refuse un mauvais mot de passe", () =>
    request(app.getHttpServer())
      .post("/api/auth/connexion")
      .send({ email: "admin@exemple.test", motDePasse: "pas-le-bon-mdp" })
      .expect(401));

  it("connecte l’admin et pose un cookie httpOnly", async () => {
    const r = await request(app.getHttpServer())
      .post("/api/auth/connexion")
      .send({ email: "ADMIN@exemple.test", motDePasse: MDP })
      .expect(200);
    const set = r.headers["set-cookie"] as unknown as string[];
    expect(set[0]).toMatch(/HttpOnly/);
    cookie = set[0].split(";")[0];
  });

  it("valide les données d’un projet", () =>
    request(app.getHttpServer())
      .post("/api/admin/projets")
      .set("Cookie", cookie)
      .send({ ...projet, slug: "Pas Un Slug", categories: ["Cuisine"] })
      .expect(400));

  it("crée, modifie, publie puis supprime un projet", async () => {
    const srv = app.getHttpServer();
    const cree = await request(srv)
      .post("/api/admin/projets")
      .set("Cookie", cookie)
      .send(projet)
      .expect(201);
    const id = cree.body.id as string;

    await request(srv).post("/api/admin/projets").set("Cookie", cookie).send(projet).expect(409);

    const pub = await request(srv).get("/api/projets").expect(200);
    expect(pub.body.map((p: { slug: string }) => p.slug)).toContain("projet-test");

    await request(srv)
      .put(`/api/admin/projets/${id}`)
      .set("Cookie", cookie)
      .send({ ...projet, publie: false, nom: "Renommé" })
      .expect(200);
    await request(srv).get("/api/projets/projet-test").expect(404);

    await request(srv).delete(`/api/admin/projets/${id}`).set("Cookie", cookie).expect(204);
    await request(srv).get(`/api/admin/projets/${id}`).set("Cookie", cookie).expect(404);
  });

  it("gère les expériences", async () => {
    const srv = app.getHttpServer();
    const e = await request(srv)
      .post("/api/admin/experiences")
      .set("Cookie", cookie)
      .send({
        periode: "2026",
        poste: "Stagiaire DevOps",
        structure: "Entreprise, Ville",
        description: "Une mission.",
        technos: ["Docker"],
      })
      .expect(201);
    const liste = await request(srv).get("/api/experiences").expect(200);
    expect(liste.body).toHaveLength(1);
    await request(srv).delete(`/api/admin/experiences/${e.body.id}`).set("Cookie", cookie).expect(204);
  });

  it("refuse un fichier qui n’est pas une image", () =>
    request(app.getHttpServer())
      .post("/api/admin/uploads")
      .set("Cookie", cookie)
      .attach("fichier", Buffer.from("pas une image du tout"), "faux.png")
      .expect(400));
});
