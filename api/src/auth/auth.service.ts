import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import type { Config } from "../config";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly conf: ConfigService<Config, true>,
  ) {}

  /** Un seul compte administrateur, défini par variables d’environnement. */
  async connecter(email: string, motDePasse: string): Promise<string> {
    const admin = this.conf.get("admin", { infer: true });
    const emailOk = email.trim().toLowerCase() === admin.email;
    // On compare toujours le mot de passe, même si l’e-mail est faux, pour un temps de réponse constant.
    const mdpOk = await bcrypt.compare(motDePasse, admin.passwordHash);
    if (!emailOk || !mdpOk) throw new UnauthorizedException("Identifiants incorrects");
    return this.jwt.signAsync({ sub: admin.email, role: "admin" });
  }
}
