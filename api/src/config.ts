/** Configuration lue dans les variables d’environnement (voir .env.example). */
export const config = () => {
  const requis = (nom: string) => {
    const v = process.env[nom];
    if (!v) throw new Error(`Variable d’environnement manquante : ${nom}`);
    return v;
  };
  return {
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: requis("DATABASE_URL"),
    jwtSecret: requis("JWT_SECRET"),
    admin: {
      email: requis("ADMIN_EMAIL").toLowerCase(),
      // Empreinte bcrypt du mot de passe : `npm run hash-password`
      passwordHash: requis("ADMIN_PASSWORD_HASH"),
    },
    uploadDir: process.env.UPLOAD_DIR ?? "./uploads",
    cookieSecure: process.env.COOKIE_SECURE !== "false",
    // Le site est prévenu après chaque modification pour se régénérer.
    revalidate: {
      url: process.env.WEB_REVALIDATE_URL ?? "",
      secret: process.env.REVALIDATE_SECRET ?? "",
    },
  };
};

export type Config = ReturnType<typeof config>;
