/* eslint-disable no-unused-vars */
import { User } from "src/entities/user.entity";
import { getRepository, EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

import { Service } from "src/models";
import { Cart } from "src/entities/cart.entity";
import { RedisService } from "./../redis/redis.service";
import { Product } from "src/entities/product.entity";

@Injectable()
export class CartService extends Service {
  constructor (
    entities: EntityManager,
    private redisService: RedisService
  ) {
    super(Cart, entities);
  }

  async getCarts (id) {
    const cartsRep = this.entities.getRepository(Cart);
    const carts = await cartsRep.find({ userId: id });
    return carts;
  }

  async getProductFromCart (cart) {
    const product = await this.entities.findOne(Product, cart.productId);
    product.numberInOrder = cart.numberOfProduct;
    product.cartId = cart.id;
    return product;
  }

  async getRemoveProductFromCart (cart) {
    const product = await this.entities.findOne(Product, cart.productId);
    return product;
  }

  async getProductsFromCart (id) {
    const carts = await this.getCarts(id);
    let products = carts.map(async cart => {
      const product = await this.getProductFromCart(cart);
      return product;
    });
    products = await Promise.all(products);
    return products;
  }

  async getProductQuantity (productId, givenQuantity) {
    const quantityOfProduct = Number(await this.redisService.get(productId));
    let currentQuantity = quantityOfProduct - givenQuantity;
    currentQuantity = currentQuantity <= 0 ? 0 : currentQuantity;
    const quantityOfProductInCart = currentQuantity <= 0 ? quantityOfProduct : givenQuantity;
    await this.redisService.set(productId, currentQuantity);
    return quantityOfProductInCart;
  }

  async getUpdateProductQuantity (productId, givenQuantity, quantityInCart) {
    const quantityOfProduct = Number(await this.redisService.get(productId));
    let currentQntity = quantityOfProduct + (quantityInCart - givenQuantity);
    if (givenQuantity >= quantityInCart && quantityOfProduct === 0) {
      currentQntity = 0;
      givenQuantity = quantityInCart;
    }
    await this.redisService.set(productId, currentQntity);
    return givenQuantity;
  }

  async addCart (userId, productId, givenQuantity) {
    const quantityOfProductInCart = await this.getProductQuantity(productId, givenQuantity);
    const rowData = {
      userId,
      productId,
      numberOfProduct: quantityOfProductInCart
    };
    await this.addRow(rowData);
    const newCart = await this.entities.findOne(this.entity, { userId: userId, productId: productId });
    return newCart;
  }

  async removeCart (id) {
    const removeCart = await this.entities.findOne(this.entity, id);
    const numberOfProduct = Number(await this.redisService.get(removeCart.productId));
    const currentNumber = numberOfProduct + removeCart.numberOfProduct;
    await this.redisService.set(removeCart.productId, currentNumber);
    await this.deleteRow(id);
    return removeCart;
  }

  async updateCart (id, body) {
    let updateCart = await this.getRow(id);
    const givenQuantity = await this.getUpdateProductQuantity(
      updateCart.productId,
      body.count,
      updateCart.numberOfProduct
    );
    const rowData = {
      numberOfProduct: givenQuantity
    };
    await this.updateRow(rowData, id);
    updateCart = await this.getRow(id);
    return updateCart;
  }
}
