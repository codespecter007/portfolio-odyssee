import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ExperienceDto {
  @IsOptional()
  @IsInt()
  ordre?: number;

  @IsOptional()
  @IsBoolean()
  publie?: boolean;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  periode: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  poste: string;

  @IsString()
  @MaxLength(120)
  structure: string;

  @IsString()
  @MaxLength(1200)
  description: string;

  @IsArray()
  @IsString({ each: true })
  technos: string[];
}
