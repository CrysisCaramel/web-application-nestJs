/* eslint-disable no-unused-vars */
import { User } from "src/entities/user.entity";
import { getRepository, EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

import { Service } from "src/models";
import { Cart } from "src/entities/cart.entity";

@Injectable()
export class CartService extends Service {
  constructor (entities: EntityManager) {
    super(Cart, entities);
  }

  async getCarts (id) {
    const cartsRep = this.entities.getRepository(Cart);
    const carts = await cartsRep.find({ userId: id });
    return carts;
  }

  async addCart (userId, productId, numberOfProduct) {
    const rowData = {
      userId,
      productId,
      numberOfProduct
    };
    await this.addRow(rowData);
    const newCart = await this.entities.findOne(this.entity, { userId: userId, productId: productId });
    return newCart;
  }

  async removeCart (id) {
    const cart = this.entities.findOne(this.entity, id);
    await this.deleteRow(id);
  }
}
