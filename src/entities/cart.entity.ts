import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number

  @Column()
  productId: number

  @Column()
  numberOfProduct: number
}
