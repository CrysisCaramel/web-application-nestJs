import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Cart } from "./cart.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column()
  avatar: string;

  @Column()
  description: string;

  @Column()
  number: number;

  @ManyToOne(type => User, user => user.products)
  user: User;

  @ManyToMany(type => Cart, cart => cart.products)
  @JoinTable()
  cart: Cart[];

  
}
