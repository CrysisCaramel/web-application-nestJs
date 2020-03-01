/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { User } from "src/entities/user.entity";
import { CartService } from "./cart.service";
import { Controller, Get, UseGuards, Request, Param, Post, Delete, Put, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("cart")
export class CartController {
  constructor (public cartService: CartService) { }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getCarts (@Request() req) {
    const userId = req.user.userId;
    const carts = await this.cartService.getCarts(userId);
    return carts;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("products")
  async getProductsFromCart (@Request() req) {
    const userId = req.user.userId;
    const products = await this.cartService.getProductsFromCart(userId);
    return products;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async getCart (@Param() params) {
    const id = params.id;
    return this.cartService.getRow(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async addCart (@Body() body, @Request() req) {
    const userId = req.user.userId;
    const productId = body.id;
    const givenQuantity = body.count;
    const cart = await this.cartService.addCart(userId, productId, givenQuantity);
    const productFromCart = await this.cartService.getProductFromCart(cart);
    return productFromCart;
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async removeCart (@Param() params) {
    const id = params.id;
    const removeCart = await this.cartService.removeCart(id);
    const removeProduct = await this.cartService.getRemoveProductFromCart(removeCart);
    return removeProduct;
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async updateCart (@Param() params, @Body() body) {
    const id = params.id;
    const updateCart = await this.cartService.updateCart(id, body);
    const updateProductInCart = await this.cartService.getProductFromCart(updateCart);
    return updateProductInCart;
  }
}
