import { getRepository, EntityManager } from "typeorm";
import { Product } from "./../entities/product.entity";
import { Injectable } from "@nestjs/common";
import { Service } from "src/models";

import { User } from "src/entities/user.entity";
import { CartService } from "src/cart/cart.service";
import { Cart } from "src/entities/cart.entity";

@Injectable()
export class ProductsService extends Service {
  constructor (entities: EntityManager, private cartService: CartService) {
    super(Product, entities);
  }

  async addProduct (product, user) {
    await this.addRow(product);
    const userRep = await getRepository(User);
    const us = await userRep.findOne(user.userId, { relations: ["products"] });
    const prod = await this.entities.findOne(Product, { name: product.name });
    us.products.push(prod);
    await this.entities.save(us);
  }

  async addToCart (user, id) {
    const product = await this.entities.findOne(Product, { id });
    const cart = await this.cartService.addCart(user);
    const cartRep = this.entities.getRepository(Cart);
    const cartWithProducts = await cartRep.findOne(cart.id, { relations: ["products"] });
    cartWithProducts.products.push(product);
    this.entities.save(cartWithProducts);
  }

  async getProductsFromUsersCart (user) {
    const userRep = await getRepository(User);
    const cartRep = await getRepository(Cart);
    const us = await userRep.findOne(user.userId, { relations: ["cart"] });
    const cart = await cartRep.findOne(us.cart.id, { relations: ["products"] });
    return cart.products;
  }
}
