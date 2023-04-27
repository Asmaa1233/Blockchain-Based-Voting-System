import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  index!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 8, unique: true })
  id!: string;

  @Column({ length: 100 })
  role!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  verified!: boolean;

}
