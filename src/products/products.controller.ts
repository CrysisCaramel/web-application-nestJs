import { Controller, Header, Get, Param, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, UploadedFiles, Inject } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductsService } from "./products.service";
import { FileInterceptor, FilesInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";
import { MinioService } from "nestjs-minio-client";
import { extname } from "path";
import { diskStorage } from "multer";

@Controller("products")
export class ProductsController {
  constructor (public productService: ProductsService, private readonly minioClient: MinioService) { }

    @Get()
    @Header("Access-Control-Allow-Origin", "*")
  async getProducts () {
    const products = await this.productService.getFullTable();
    return products;
  }

    @Get(":id")
    getUser (@Param() params) {
      const id = params.id;
      return this.productService.getRow(id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("add")
    @Header("Access-Control-Allow-Origin", "*")
    @UseInterceptors(FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("");
          cb(null, `${randomName}${extname(file.originalname)}`);
        }
      })
    }))
    async uploadFile (@UploadedFile() file, @Request() req) {
      console.log(await this.minioClient.client.listBuckets());
      const f = file.path;
      var metaData = {
        "Content-Type": "text/html",
        "Content-Language": 123,
        "X-Amz-Meta-Testing": 1234,
        example: 5678
      };
      this.minioClient.client.fPutObject("mybucket", "40mbfile", f, metaData, function (err, etag) {
        return console.log(err, etag); // err should be null
      });
    }

  // async addProduct (@UploadedFile() avatar, @Request() req) {
  //     console.log(avatar);
  //     // const user = req.user
  //     // this.productService.addProduct(product, user)
  // }
}
