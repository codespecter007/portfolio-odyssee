import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RevalidationService } from "../common/revalidation.service";
import { Experience } from "../entities/experience.entity";
import type { ExperienceDto } from "./experience.dto";

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience) private readonly repo: Repository<Experience>,
    private readonly revalidation: RevalidationService,
  ) {}

  listerPubliees() {
    return this.repo.find({ where: { publie: true }, order: { ordre: "ASC", createdAt: "ASC" } });
  }

  listerToutes() {
    return this.repo.find({ order: { ordre: "ASC", createdAt: "ASC" } });
  }

  async parId(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException("Expérience introuvable");
    return e;
  }

  async creer(dto: ExperienceDto) {
    const dernier = await this.repo.maximum("ordre");
    const e = await this.repo.save(this.repo.create({ ...dto, ordre: dto.ordre ?? (dernier ?? 0) + 1 }));
    await this.revalidation.signaler("experiences");
    return e;
  }

  async modifier(id: string, dto: ExperienceDto) {
    const e = await this.parId(id);
    const maj = await this.repo.save({ ...e, ...dto });
    await this.revalidation.signaler("experiences");
    return maj;
  }

  async supprimer(id: string) {
    await this.repo.remove(await this.parId(id));
    await this.revalidation.signaler("experiences");
  }
}
