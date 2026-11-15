// Calcule l’empreinte bcrypt du mot de passe admin, à mettre dans ADMIN_PASSWORD_HASH.
// Usage : npm run hash-password -- "mon mot de passe"
import bcrypt from "bcryptjs";

const mdp = process.argv[2];
if (!mdp || mdp.length < 12) {
  console.error("Donne un mot de passe d’au moins 12 caractères.");
  process.exit(1);
}
console.log(await bcrypt.hash(mdp, 12));
