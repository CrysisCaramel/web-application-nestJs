import { Controller, Get, Post, Body, Put, Param, UseGuards, Request, Options, Header, Res, HttpStatus } from "@nestjs/common";
import { UsersService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { Response } from 'express';

@Controller("users")
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (public userService: UsersService) { }

  @Options()
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Method', '*')

  @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.userService.getRow(id);
  }

  @Get()
  async getUsers (@Res() request: Response) {
    const users = await this.userService.getFullTable();
    console.log(users)
    return request.status(HttpStatus.OK).json(users)
  }


  @Post("register")
  addUser (@Body() user) {
    return this.userService.addRow(user);
  }

}
