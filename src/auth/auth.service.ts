import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(User) private UsersRep: Repository<User>,
    private jwtService: JwtService
  ) { }

  async validateUser (username: string, pass: string): Promise<any> {
    const user = await this.UsersRep.findOne({ name: username });
    const bcrypt = require("bcrypt");
    const comparePass = await bcrypt.compare(pass, user.password);
    if (user && comparePass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login (user: any) {
    const payload = { username: user.name, sub: user.id };
    return {
      username: payload.username,
      token: this.jwtService.sign(payload)
    };
  }
}
