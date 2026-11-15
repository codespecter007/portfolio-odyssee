import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Config } from "../config";

/** Prévient le site Next.js qu’il doit régénérer ses pages après une modification. */
@Injectable()
export class RevalidationService {
  private readonly log = new Logger("Revalidation");
  constructor(private readonly conf: ConfigService<Config, true>) {}

  async signaler(tag: "projets" | "experiences") {
    const { url, secret } = this.conf.get("revalidate", { infer: true });
    if (!url) return;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-revalidate-secret": secret },
        body: JSON.stringify({ tag }),
        signal: AbortSignal.timeout(3000),
      });
    } catch (e) {
      this.log.warn(`Site non prévenu (${tag}) : ${(e as Error).message}`);
    }
  }
}
