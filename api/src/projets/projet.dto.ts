import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

export const CATEGORIES = ["Web", "Applications", "DevOps", "IA", "Réseaux"] as const;

class TechnoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  nom: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  logo?: string;
}

/** Données d’un projet envoyées par l’espace admin. */
export class ProjetDto {
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Le slug ne contient que des minuscules, chiffres et tirets",
  })
  @MaxLength(80)
  slug: string;

  @IsOptional()
  @IsInt()
  ordre?: number;

  @IsOptional()
  @IsBoolean()
  publie?: boolean;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  nom: string;

  @IsString()
  @MaxLength(120)
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  annee?: string | null;

  @IsArray()
  @IsIn(CATEGORIES, { each: true })
  categories: string[];

  @IsString()
  @MaxLength(600)
  description: string;

  @IsString()
  @MaxLength(400)
  role: string;

  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => TechnoDto)
  technologies: TechnoDto[];

  @IsObject()
  visuel: Record<string, unknown>;

  @IsObject()
  etude: Record<string, unknown>;
}

export class OrdreDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
