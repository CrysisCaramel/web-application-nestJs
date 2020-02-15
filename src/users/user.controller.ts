import { Controller, Get, Post, Body, Put, Param, UseGuards, Request, Options, Header, Res, HttpStatus } from "@nestjs/common";
import { UsersService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { Response } from 'express';
import { AuthService } from "src/auth/auth.service";

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
  @Header('Access-Control-Allow-Origin', '*')
  async getUsers () {
    const users = await this.userService.getFullTable();
    return users
  }

  @Post("register")
  @Header('Access-Control-Allow-Origin', '*')
  async addUser (@Body() user) {
    const regUser = await this.userService.findRegUser(user)
    return regUser
  }


}
