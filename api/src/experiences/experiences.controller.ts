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
import { ExperienceDto } from "./experience.dto";
import { ExperiencesService } from "./experiences.service";

@Controller("experiences")
export class ExperiencesController {
  constructor(private readonly experiences: ExperiencesService) {}

  @Get()
  lister() {
    return this.experiences.listerPubliees();
  }
}

@Controller("admin/experiences")
@UseGuards(AdminGuard)
export class AdminExperiencesController {
  constructor(private readonly experiences: ExperiencesService) {}

  @Get()
  lister() {
    return this.experiences.listerToutes();
  }

  @Get(":id")
  lire(@Param("id", ParseUUIDPipe) id: string) {
    return this.experiences.parId(id);
  }

  @Post()
  creer(@Body() dto: ExperienceDto) {
    return this.experiences.creer(dto);
  }

  @Put(":id")
  modifier(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ExperienceDto) {
    return this.experiences.modifier(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  supprimer(@Param("id", ParseUUIDPipe) id: string) {
    return this.experiences.supprimer(id);
  }
}
