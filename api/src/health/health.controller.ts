import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { DataSource } from "typeorm";

/** Santé de l’API, utilisée par Docker et par le pipeline après déploiement. */
@Controller("health")
export class HealthController {
  constructor(private readonly db: DataSource) {}

  @Get()
  async sante() {
    try {
      await this.db.query("SELECT 1");
      return { statut: "ok" };
    } catch {
      throw new ServiceUnavailableException({ statut: "base de données injoignable" });
    }
  }
}
