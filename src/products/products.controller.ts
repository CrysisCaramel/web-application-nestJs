/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { Controller, Get, Param, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, Query, Response, Put } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductsService } from "./products.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";

@Controller("products")
export class ProductsController {
  constructor (
    public productService: ProductsService
  ) { }

  @Get()
  async getProducts () {
    const products = await this.productService.getAllProducts();
    return products;
  }

  @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.productService.getRow(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (
          Math.round(Math.random() * 16)
        ).toString(16)).join("");
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createProduct (@UploadedFile() file, @Request() req) {
    const user = req.user;
    const body = req.body;
    const newProduct = await this.productService.addProduct(file, body, user);
    return newProduct;
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (
          Math.round(Math.random() * 16)
        ).toString(16)).join("");
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async editProduct (@Param() params, @Request() req, @UploadedFile() file) {
    const id = params.id;
    const body = req.body;
    const updateProduct = await this.productService.updateProduct(id, file, body);
    return updateProduct;
  }
}
