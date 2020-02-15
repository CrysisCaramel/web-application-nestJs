import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/user.controller';
import { UsersService } from './users/user.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "changeme",
    database: "mydb",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true
  }),
  AuthModule
],
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService, UsersService, ProductsService],
})
export class AppModule {}
