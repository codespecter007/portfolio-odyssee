import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../auth/auth.guard";
import { OrdreDto, ProjetDto } from "./projet.dto";
import { ProjetsService } from "./projets.service";

/** Lecture publique, utilisée par le site. */
@Controller("projets")
export class ProjetsController {
  constructor(private readonly projets: ProjetsService) {}

  @Get()
  lister() {
    return this.projets.listerPublies();
  }

  @Get(":slug")
  lire(@Param("slug") slug: string) {
    return this.projets.parSlug(slug);
  }
}

/** Gestion depuis l’espace admin. */
@Controller("admin/projets")
@UseGuards(AdminGuard)
export class AdminProjetsController {
  constructor(private readonly projets: ProjetsService) {}

  @Get()
  lister() {
    return this.projets.listerTous();
  }

  @Get(":id")
  lire(@Param("id", ParseUUIDPipe) id: string) {
    return this.projets.parId(id);
  }

  @Post()
  creer(@Body() dto: ProjetDto) {
    return this.projets.creer(dto);
  }

  @Put("ordre")
  reordonner(@Body() dto: OrdreDto) {
    return this.projets.reordonner(dto.ids);
  }

  @Put(":id")
  modifier(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ProjetDto) {
    return this.projets.modifier(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  supprimer(@Param("id", ParseUUIDPipe) id: string) {
    return this.projets.supprimer(id);
  }
}
