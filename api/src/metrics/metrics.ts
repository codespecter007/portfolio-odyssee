import { Controller, Get, Header, Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { collectDefaultMetrics, Counter, Histogram, Registry } from "prom-client";

/** Métriques Prometheus de l’API, lues par Grafana. */
export const registre = new Registry();
registre.setDefaultLabels({ app: "portfolio-api" });
collectDefaultMetrics({ register: registre });

const requetes = new Counter({
  name: "http_requests_total",
  help: "Nombre de requêtes HTTP",
  labelNames: ["method", "route", "status"],
  registers: [registre],
});
const duree = new Histogram({
  name: "http_request_duration_seconds",
  help: "Durée des requêtes HTTP",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [registre],
});

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const fin = duree.startTimer();
    res.on("finish", () => {
      // On regroupe par route déclarée (et non par URL) pour éviter l’explosion des séries.
      const route = (req.route?.path as string | undefined) ?? "inconnue";
      const labels = { method: req.method, route: req.baseUrl + route, status: String(res.statusCode) };
      requetes.inc(labels);
      fin(labels);
    });
    next();
  }
}

@Controller("metrics")
export class MetricsController {
  @Get()
  @Header("Content-Type", registre.contentType)
  metriques() {
    return registre.metrics();
  }
}
