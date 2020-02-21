import { User } from 'src/entities/user.entity';
import { CartService } from './cart.service';
import { Controller, Get, UseGuards, Request, Param, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
    constructor(public cartService: CartService) {}

    
    @Get()
    async getCarts () {
        const carts = await this.cartService.getFullTable();
        return carts;
    }

    @Get(":id")
    getCart (@Param() params) {
      const id = params.id;
      return this.cartService.getRow(id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("add")
    addCart(@Request() req) {
        const user = req.user
        this.cartService.addCart(user)
    }


}
