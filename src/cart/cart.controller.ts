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
  @Post()
  async addCart (@Body() body, @Request() req) {
    const userId = req.user.userId;
    const productId = body.id;
    const numberOfProduct = body.count;
    const cart = await this.cartService.addCart(userId, productId, numberOfProduct);
    return cart;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async getCart (@Param() params) {
    const id = params.id;
    return this.cartService.getRow(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async removeCart (@Param() params) {
    const id = params.id;
    await this.cartService.removeCart(id);
  }
}
