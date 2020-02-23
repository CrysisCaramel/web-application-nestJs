import { User } from "src/entities/user.entity";
import { Controller, Header, Get, Param, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, UploadedFiles, Inject, Query, Response } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductsService } from "./products.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinioService } from "nestjs-minio-client";
import { extname } from "path";
import { diskStorage } from "multer";
import { ClientProxy, MessagePattern, Payload, Ctx, RedisContext } from "@nestjs/microservices";

@Controller("products")
export class ProductsController {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public productService: ProductsService,
    private readonly minioClient: MinioService,
    @Inject("MATH_SERVICE") private readonly client: ClientProxy
  ) { }

  @Get()
  async getProducts () {
    const products = await this.productService.getAllProducts();
    return products;
  }

  @MessagePattern("notifications")
  getNotifications (@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(context, data);
    console.log(`Channel: ${context.getChannel()}`);
  }

  @Get("download")
  async downloadImg (@Query("file") file, @Response() res) {
    return this.minioClient.client.getObject("mybucket", file, function (err, dataStream) {
      if (err) {
        return res.status(500).send(err);
      }
      dataStream.pipe(res);
    });
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("from-users-cart")
  async getProductsFromUsersCart (@Request() req) {
    const user = req.user;
    const products = await this.productService.getProductsFromUsersCart(user);
    return products;
  }

  @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.productService.getRow(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("");
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createProduct (@UploadedFile() file, @Request() req) {
    const user = req.user;
    const imgName = file.filename;
    const product = {
      name: req.body.title,
      description: req.body.description,
      avatar: imgName,
      number: Number.parseInt(req.body.count)
    };
    this.productService.addProduct(product, user);
    const metaData = {
      "Content-Type": "image"
    };
    this.minioClient.client.fPutObject("mybucket", imgName, file.path, metaData, function (err, etag) {
      return console.log(err, etag);
    });
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("add-to-cart")
  async addToCart (@Request() req, @Body() body) {
    const user = req.user;
    const productId = body.id;
    await this.productService.addToCart(user, productId);
  }
}
