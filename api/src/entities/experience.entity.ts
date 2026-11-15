import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/** Une expérience professionnelle (stage, job, engagement). */
@Entity("experiences")
export class Experience {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 0 })
  ordre: number;

  @Column({ default: true })
  publie: boolean;

  @Column()
  periode: string;

  @Column()
  poste: string;

  @Column()
  structure: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  technos: string[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
