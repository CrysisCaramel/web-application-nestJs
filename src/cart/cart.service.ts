import { User } from "src/entities/user.entity";
import { EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

import { Service } from "src/models";
import { Cart } from "src/entities/cart.entity";

@Injectable()
export class CartService extends Service {
  constructor (entities: EntityManager) {
    super(Cart, entities);
  }

  async addCart (user) {
    const userRep = this.entities.getRepository(User);
    const us = await userRep.findOne(user.userId, { relations: ["cart"] });
    if (!us.cart) {
      const newCart = new Cart();
      await this.entities.save(newCart);
      us.cart = newCart;
      await this.entities.save(us);
      return newCart;
    }
    return us.cart;
  }

  async getUsersCart (user) {
    const userRep = this.entities.getRepository(User);
    const cartRep = this.entities.getRepository(Cart);
    const us = await userRep.findOne(user.userId, { relations: ["cart"] });
    const cart = await cartRep.findOne(us.cart.id, { relations: ["products"] });
    return cart;
  }
}
