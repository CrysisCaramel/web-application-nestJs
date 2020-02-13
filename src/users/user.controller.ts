import { Controller, Get, Post, Body, Put, Param, UseGuards, Request, Options, Header, Res, HttpStatus } from "@nestjs/common";
import { UsersService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { Response } from 'express';

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
  addUser (@Body() user) {
    return this.userService.addRow(user);
  }

}
