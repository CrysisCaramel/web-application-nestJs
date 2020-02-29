/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import { Controller, Get, Query, Response } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";

@Controller("image")
export class ImageController {
  constructor (
    private readonly minioClient: MinioService
  ) { }

  @Get()
  async downloadImg (@Query("file") file, @Response() res) {
    return this.minioClient.client.getObject(
      "mybucket",
      file,
      function (err, dataStream) {
        if (err) {
          return res.status(500).send(err);
        }
        dataStream.pipe(res);
      });
  }
}
