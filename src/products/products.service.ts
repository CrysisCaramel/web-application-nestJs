/* eslint-disable no-unused-vars */
import { getRepository, EntityManager } from "typeorm";
import { Product } from "./../entities/product.entity";
import { Injectable } from "@nestjs/common";
import { Service } from "src/models";

import { User } from "src/entities/user.entity";
import { CartService } from "src/cart/cart.service";
import { Cart } from "src/entities/cart.entity";

@Injectable()
export class ProductsService extends Service {
  client: any;
  redis: any;
  constructor (entities: EntityManager, private cartService: CartService) {
    super(Product, entities);
    this.redis = require("redis");
    this.client = this.redis.createClient();
  }

  async redisGet (key) {
    return new Promise(resolve => {
      this.client.get(key, function (er, reply) {
        resolve(reply);
      });
    });
  }

  async redisSet (key, value) {
    return new Promise(resolve => {
      resolve(this.client.set(key, value));
    });
  }

  async redisIncr (key) {
    return new Promise(resolve => {
      resolve(this.client.incr(key));
    });
  }

  async redisDecr (key) {
    return new Promise(resolve => {
      resolve(this.client.decr(key));
    });
  }

  async getAllProducts () {
    const products = await this.entities.find(this.entity, { relations: ["user"] });
    return products.map(({ id, name, avatar, description, user }) => {
      return {
        id,
        name,
        avatar,
        description,
        userId: user.id
      };
    });
  }

  async addProduct (product, user) {
    await this.addRow(product);
    const userRep = await getRepository(User);
    const us = await userRep.findOne(user.userId, { relations: ["products"] });
    const prod = await this.entities.findOne(Product, { name: product.name });
    await this.redisSet(prod.id, 1);
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

  async setNumberProducts (query) {
    const { id, method } = query;
    method === "incr" ? await this.redisIncr(id) : await this.redisDecr(id);
  }
}
