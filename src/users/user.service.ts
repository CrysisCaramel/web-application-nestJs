import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Service } from "../models";
import { User } from "../entities/user.entity";
import { EntityManager, getRepository } from "typeorm";
@Injectable()
export class UsersService extends Service {
  constructor (entities: EntityManager) {
    super(User, entities);
  }

  
}
