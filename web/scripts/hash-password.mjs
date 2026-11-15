// Calcule le hash bcrypt du mot de passe admin, à copier dans ADMIN_PASSWORD_HASH.
// Usage : npm run hash-password -- "mon mot de passe"
import bcrypt from "bcryptjs";

const mdp = process.argv[2];
if (!mdp || mdp.length < 12) {
  console.error("Donnez un mot de passe d’au moins 12 caractères entre guillemets.");
  process.exit(1);
}
console.log(bcrypt.hashSync(mdp, 12));
