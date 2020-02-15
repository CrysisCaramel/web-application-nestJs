import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Service } from "../models";
import { User } from "../entities/user.entity";
import { EntityManager, getRepository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
@Injectable()
export class UsersService extends Service {
  constructor (entities: EntityManager, private readonly authService: AuthService) {
    super(User, entities);
  }

  async findRegUser(user) {
    const usersRep = this.entities.getRepository(User);
    const allUsers = await this.entities.find(this.entity)
    const validate = allUsers.find(us => us.name == user.name)
    if (!validate) {
      await this.addRow(user)
      const regUser = await usersRep.findOne({ name: user.name })
      return this.authService.login(regUser)
    } 
    return {error: "the user is registered"}
  }
  
}
