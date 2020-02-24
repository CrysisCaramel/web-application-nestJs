import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity";
import { Cart } from "./cart.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column({ nullable: true })
  birthDate: string;

  @OneToMany(type => Product, product => product.user)
  products: Product[];

  @OneToOne(type => Cart)
  @JoinColumn()
  cart: Cart;
}
