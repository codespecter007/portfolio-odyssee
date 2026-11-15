import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import { IsEmail, IsString, MinLength } from "class-validator";
import type { Request, Response } from "express";
import type { Config } from "../config";
import { AdminGuard, COOKIE } from "./auth.guard";
import { AuthService } from "./auth.service";

class ConnexionDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  motDePasse: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly conf: ConfigService<Config, true>,
  ) {}

  /** Cinq tentatives par minute au maximum. */
  @Post("connexion")
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async connexion(@Body() dto: ConnexionDto, @Res({ passthrough: true }) res: Response) {
    const jeton = await this.auth.connecter(dto.email, dto.motDePasse);
    res.cookie(COOKIE, jeton, {
      httpOnly: true,
      secure: this.conf.get("cookieSecure", { infer: true }),
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
    });
    return { ok: true };
  }

  @Post("deconnexion")
  @HttpCode(200)
  deconnexion(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE, { path: "/" });
    return { ok: true };
  }

  @Get("moi")
  @UseGuards(AdminGuard)
  moi(@Req() req: Request & { admin?: string }) {
    return { email: req.admin };
  }
}
