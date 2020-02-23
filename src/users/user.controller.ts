import { Controller, Get, Post, Body, Put, Param, UseGuards, Request, Options, Header, Res, HttpStatus } from "@nestjs/common";
import { UsersService } from "./user.service";
const bcrypt = require("bcrypt");

@Controller("users")
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (public userService: UsersService) { }

  @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.userService.getRow(id);
  }

  @Get()
  async getUsers () {
    const users = await this.userService.getFullTable();
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
    const regUser = await this.userService.findRegUser(user);
    return regUser;
  }
}
