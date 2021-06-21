import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from "typeorm";

@Entity()
@Index(["title", "url"], { unique: true })
export class Apod {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  url!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  explanation!: string;

  @Column({ nullable: false, name: "media_type" })
  mediaType!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date;
}
