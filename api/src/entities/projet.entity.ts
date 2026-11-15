import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/** Un projet du portfolio. Les parties riches (visuel, étude de cas) sont stockées en JSON. */
@Entity("projets")
export class Projet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "int", default: 0 })
  ordre: number;

  @Column({ default: true })
  publie: boolean;

  @Column()
  nom: string;

  @Column()
  type: string;

  @Column({ type: "varchar", nullable: true })
  annee: string | null;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  categories: string[];

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  role: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  technologies: { nom: string; logo?: string }[];

  @Column({ type: "jsonb", default: () => `'{"type":"vide"}'` })
  visuel: Record<string, unknown>;

  @Column({ type: "jsonb", default: () => "'{}'" })
  etude: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
