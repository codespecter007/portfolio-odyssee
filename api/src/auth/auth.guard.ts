import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export const COOKIE = "admin_session";

/** Protège les routes d’administration : jeton JWT dans un cookie httpOnly. */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const jeton = req.cookies?.[COOKIE];
    if (!jeton) throw new UnauthorizedException("Connexion requise");
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; role: string }>(jeton);
      if (payload.role !== "admin") throw new Error();
      (req as Request & { admin?: string }).admin = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException("Session expirée");
    }
  }
}
