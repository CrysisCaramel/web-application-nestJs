/* eslint-disable no-unused-vars */
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UsersService } from "./user.service";
const bcrypt = require("bcrypt");

@Controller("users")
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (public userService: UsersService) { }

  @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.userService.getUser(id);
  }

  @Get()
  async getUsers () {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Post("register")
  async addUser (@Body() body) {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(body.password, saltRounds);
    const user = {
      ...body,
      password: hashPass
    };
    const regUser = await this.userService.addUser(user);
    return regUser;
  }
}
