/* eslint-disable no-unused-vars */
import { Controller, Get, UseGuards, Post, Request, Header, Options } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly appService: AppService, private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  @Header("Access-Control-Allow-Origin", "*")
  async login (@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile (@Request() req) {
    return req.user;
  }
}
