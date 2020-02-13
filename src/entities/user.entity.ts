import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  numberOfLatestLikes: number;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column({ nullable: true })
  birthDate: string;
  
}
