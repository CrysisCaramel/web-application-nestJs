/* eslint-disable no-unused-vars */
import { CartService } from "./../cart/cart.service";
import { Injectable } from "@nestjs/common";
import { Service } from "../models";
import { User } from "../entities/user.entity";
import { EntityManager } from "typeorm";
import { AuthService } from "src/auth/auth.service";
@Injectable()
export class UsersService extends Service {
  constructor (
    entities: EntityManager,
    private readonly authService: AuthService,
    private cartService: CartService
  ) {
    super(User, entities);
  }

  async getAllUsers () {
    const allUsers = await this.entities.find(this.entity);
    return allUsers.map(({ id, name, products, cart }) => {
      return { id, name };
    });
  }

  async getUser (userId) {
    const { id, name } = await this.entities.findOne(this.entity, userId);
    return {
      id,
      name
    };
  }

  async addUser (user) {
    const usersRep = this.entities.getRepository(User);
    const allUsers = await this.entities.find(this.entity);
    const validate = allUsers.find(us => us.name === user.name);
    if (!validate) {
      await this.addRow(user);
      const regUser = await usersRep.findOne({ name: user.name });
      this.cartService.addCart(regUser);
      return this.authService.login(regUser);
    }
    return { error: "the user is registered" };
  }
}
