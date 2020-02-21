import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Service } from 'src/models';
import { Cart } from 'src/entities/cart.entity';

@Injectable()
export class CartService extends Service {
    constructor (entities: EntityManager) {
        super(Cart, entities);
    }

   async addCart(user) {
        const userRep = this.entities.getRepository(User)
        const us = await userRep.findOne(user.userId, { relations: ["cart"]})
        const newCart = new Cart()
        await this.entities.save(newCart);
        us.cart = newCart
        await this.entities.save(us);
        
        
    }
}
