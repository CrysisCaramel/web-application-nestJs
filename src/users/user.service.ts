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
    private readonly authService: AuthService
  ) {
    super(User, entities);
  }

  async getAllUsers () {
    const allUsers = await this.entities.find(this.entity, { select: ["id", "name"] });
    return allUsers;
  }

  async getUser (userId) {
    const user = await this.entities.findOne(this.entity, userId, { select: ["id", "name"] });
    return user;
  }

  async addUser (user) {
    const usersRep = this.entities.getRepository(User);
    const allUsers = await this.entities.find(this.entity);
    const checkUser = allUsers.find(us => us.name === user.name);
    if (!checkUser) {
      await this.addRow(user);
      const regUser = await usersRep.findOne({ name: user.name });
      return this.authService.login(regUser);
    }
    return { error: "the user is registered" };
  }
}
