import { getRepository } from 'typeorm';
import { Product } from './../entities/product.entity';
import { Injectable } from '@nestjs/common';
import { Service } from 'src/models';
import { EntityManager } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ProductsService extends Service{
    constructor (entities: EntityManager) {
        super(Product, entities);
    }

    async addProduct(product, user) {
        await this.addRow(product)
        const userRep = await getRepository(User)
        const us = await userRep.findOne(user.id, { relations: ["products"]})
        const prod = await this.entities.findOne(Product, {name: product.name})
        us.products.push(prod)
        await this.entities.save(us)
    }
}
