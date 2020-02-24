import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Product, product => product.cart)
  products: Product[];
}
