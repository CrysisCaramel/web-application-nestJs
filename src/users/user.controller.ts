/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UsersService } from "./user.service";
const bcrypt = require("bcrypt");

@Controller("users")
export class UsersController {
  constructor (public userService: UsersService) { }

  @Get()
  async getUsers () {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.userService.getUser(id);
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
