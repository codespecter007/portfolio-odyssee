import { sql } from "@/lib/serveur/db";
import { repondre, route } from "@/lib/serveur/http";

const n = (v: unknown) => Number(v ?? 0);

/** Statistiques agrégées sur une période (7, 30, 90 ou 365 jours). */
export const GET = route(async (req) => {
  const demande = Number(new URL(req.url).searchParams.get("jours"));
  const jours = [7, 30, 90, 365].includes(demande) ? demande : 30;
  const periode = `cree >= date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris' - make_interval(days => $1 - 1)`;
  const p = [jours];

  const [totaux, parJour, pages, sources, paysR, appareils, liens, sessions, nonLus] =
    await Promise.all([
      sql(
        `SELECT count(DISTINCT session) AS visites,
              count(*) FILTER (WHERE type = 'vue') AS vues,
              count(*) FILTER (WHERE type = 'cv') AS cv,
              count(*) FILTER (WHERE type IN ('email', 'email-copie')) AS email,
              count(*) FILTER (WHERE type = 'linkedin') AS linkedin,
              count(*) FILTER (WHERE type = 'github') AS github
       FROM evenements WHERE ${periode}`,
        p,
      ),
      sql(
        `SELECT to_char(j, 'YYYY-MM-DD') AS jour,
              count(DISTINCT e.session) AS visites,
              count(e.id) FILTER (WHERE e.type = 'vue') AS vues
       FROM generate_series(
              date_trunc('day', now() AT TIME ZONE 'Europe/Paris') - make_interval(days => $1 - 1),
              date_trunc('day', now() AT TIME ZONE 'Europe/Paris'), interval '1 day') AS j
       LEFT JOIN evenements e ON date_trunc('day', e.cree AT TIME ZONE 'Europe/Paris') = j
       GROUP BY j ORDER BY j`,
        p,
      ),
      sql(
        `SELECT chemin AS nom, count(*) AS vues, count(DISTINCT session) AS visites
       FROM evenements WHERE type = 'vue' AND ${periode}
       GROUP BY chemin ORDER BY vues DESC LIMIT 12`,
        p,
      ),
      sql(
        `SELECT source AS nom, count(DISTINCT session) AS visites
       FROM evenements WHERE type = 'vue' AND source IS NOT NULL AND ${periode}
       GROUP BY source ORDER BY visites DESC LIMIT 10`,
        p,
      ),
      sql(
        `SELECT coalesce(pays, '?') AS nom, count(DISTINCT session) AS visites
       FROM evenements WHERE ${periode} GROUP BY 1 ORDER BY visites DESC LIMIT 10`,
        p,
      ),
      sql(
        `SELECT appareil AS nom, count(DISTINCT session) AS visites
       FROM evenements WHERE ${periode} GROUP BY 1 ORDER BY visites DESC`,
        p,
      ),
      sql(
        `SELECT ref AS nom, count(DISTINCT session) AS visites,
              count(*) FILTER (WHERE type = 'vue') AS vues,
              count(*) FILTER (WHERE type = 'cv') AS cv,
              count(*) FILTER (WHERE type NOT IN ('vue', 'cv')) AS contacts,
              max(cree) AS derniere
       FROM evenements WHERE ref IS NOT NULL
       GROUP BY ref ORDER BY derniere DESC LIMIT 50`,
      ),
      sql(
        `SELECT session, min(cree) AS debut, max(cree) AS fin,
              max(pays) AS pays, max(appareil) AS appareil, max(source) AS source, max(ref) AS ref,
              count(*) FILTER (WHERE type = 'vue') AS vues,
              array_agg(chemin ORDER BY cree) FILTER (WHERE type = 'vue') AS parcours,
              array_agg(DISTINCT type) FILTER (WHERE type <> 'vue') AS actions
       FROM evenements WHERE ${periode}
       GROUP BY session ORDER BY debut DESC LIMIT 25`,
        p,
      ),
      sql(`SELECT count(*) AS n FROM messages WHERE NOT lu`),
    ]);

  const t = totaux[0];
  return repondre({
    jours,
    totaux: {
      visites: n(t.visites),
      vues: n(t.vues),
      cv: n(t.cv),
      email: n(t.email),
      linkedin: n(t.linkedin),
      github: n(t.github),
      messagesNonLus: n(nonLus[0].n),
    },
    parJour: parJour.map((r) => ({ jour: r.jour, visites: n(r.visites), vues: n(r.vues) })),
    pages: pages.map((r) => ({ nom: r.nom, vues: n(r.vues), visites: n(r.visites) })),
    sources: sources.map((r) => ({ nom: r.nom, visites: n(r.visites) })),
    pays: paysR.map((r) => ({ nom: r.nom, visites: n(r.visites) })),
    appareils: appareils.map((r) => ({ nom: r.nom, visites: n(r.visites) })),
    liens: liens.map((r) => ({
      nom: r.nom,
      visites: n(r.visites),
      vues: n(r.vues),
      cv: n(r.cv),
      contacts: n(r.contacts),
      derniere: r.derniere,
    })),
    sessions: sessions.map((r) => ({
      debut: r.debut,
      fin: r.fin,
      pays: r.pays,
      appareil: r.appareil,
      source: r.source,
      ref: r.ref,
      vues: n(r.vues),
      parcours: (r.parcours as string[] | null) ?? [],
      actions: (r.actions as string[] | null) ?? [],
    })),
  });
});
