import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RevalidationService } from "../common/revalidation.service";
import { Projet } from "../entities/projet.entity";
import type { ProjetDto } from "./projet.dto";

@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet) private readonly repo: Repository<Projet>,
    private readonly revalidation: RevalidationService,
  ) {}

  listerPublies() {
    return this.repo.find({ where: { publie: true }, order: { ordre: "ASC", createdAt: "ASC" } });
  }

  listerTous() {
    return this.repo.find({ order: { ordre: "ASC", createdAt: "ASC" } });
  }

  async parSlug(slug: string) {
    const p = await this.repo.findOne({ where: { slug, publie: true } });
    if (!p) throw new NotFoundException("Projet introuvable");
    return p;
  }

  async parId(id: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException("Projet introuvable");
    return p;
  }

  async creer(dto: ProjetDto) {
    await this.slugLibre(dto.slug);
    const dernier = await this.repo.maximum("ordre");
    const p = await this.repo.save(this.repo.create({ ...dto, ordre: dto.ordre ?? (dernier ?? 0) + 1 }));
    await this.revalidation.signaler("projets");
    return p;
  }

  async modifier(id: string, dto: ProjetDto) {
    const p = await this.parId(id);
    if (dto.slug !== p.slug) await this.slugLibre(dto.slug);
    const maj = await this.repo.save({ ...p, ...dto });
    await this.revalidation.signaler("projets");
    return maj;
  }

  async supprimer(id: string) {
    const p = await this.parId(id);
    await this.repo.remove(p);
    await this.revalidation.signaler("projets");
  }

  /** Enregistre un nouvel ordre d’affichage à partir de la liste des identifiants. */
  async reordonner(ids: string[]) {
    await this.repo.manager.transaction(async (m) => {
      for (const [i, id] of ids.entries()) await m.update(Projet, { id }, { ordre: i + 1 });
    });
    await this.revalidation.signaler("projets");
    return this.listerTous();
  }

  private async slugLibre(slug: string) {
    if (await this.repo.exists({ where: { slug } }))
      throw new ConflictException(`Le slug « ${slug} » est déjà utilisé`);
  }
}
