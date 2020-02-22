import { User } from "src/entities/user.entity";
import { CartService } from "./cart.service";
import { Controller, Get, UseGuards, Request, Param, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("cart")
export class CartController {
  constructor (public cartService: CartService) { }

  @Get()
  async getCarts () {
    const carts = await this.cartService.getFullTable();
    return carts;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("users")
  async getUsersCart (@Request() req) {
    const user = req.user;
    const cart = await this.cartService.getUsersCart(user);
    return cart;
  }

  @Get(":id")
  getCart (@Param() params) {
    const id = params.id;
    return this.cartService.getRow(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  async addCart (@Request() req) {
    const user = req.user;
    const cart = await this.cartService.addCart(user);
  }
}
