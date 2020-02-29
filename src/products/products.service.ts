/* eslint-disable no-unused-vars */
import { getRepository, EntityManager } from "typeorm";
import { Product } from "./../entities/product.entity";
import { Injectable } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";

import { User } from "src/entities/user.entity";
import { Service } from "src/models";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class ProductsService extends Service {
  constructor (
    entities: EntityManager,
    private minioClient: MinioService,
    private redisService: RedisService
  ) {
    super(Product, entities);
  }

  addImageToMinio (imgName, path) {
    const metaData = {
      "Content-Type": "image"
    };
    this.minioClient.client.fPutObject("mybucket",
      imgName,
      path,
      metaData,
      function (err, etag) {
        return console.log(err, etag);
      });
  }

  async getAllProducts () {
    const products = await this.entities.find(this.entity, { relations: ["user"] });
    return products.map(product => ({
      id: product.id,
      name: product.name,
      avatar: product.avatar,
      description: product.description,
      userId: product.user.id
    }));
  }

  async addProduct (file, body, user) {
    const imgName = file.filename;
    const number = body.count;
    const product = {
      name: body.title,
      description: body.description,
      avatar: imgName
    };
    const userRep = await getRepository(User);
    const us = await userRep.findOne(user.userId, {
      relations: ["products"]
    });
    await this.addRow(product);
    this.addImageToMinio(imgName, file.path);
    const prod = await this.entities.findOne(Product, { name: product.name });
    us.products.push(prod);
    await this.entities.save(us);
    this.redisService.set(prod.id, number);
    const newProduct = {
      ...prod,
      userId: us.id
    };
    return newProduct;
  }

  async updateProduct (id, file, body) {
    const number = body.count;
    const productRep = await this.entities.getRepository(Product);
    const imgName = file ? file.filename : null;
    if (file) {
      this.addImageToMinio(imgName, file.path);
    }
    const product = {
      name: body.title,
      description: body.description,
      avatar: imgName
    };
    await this.updateRow(product, id);
    let updateProduct = await productRep.findOne(id, { relations: ["user"] });
    this.redisService.set(id, number);
    updateProduct = {
      id: updateProduct.id,
      name: updateProduct.name,
      avatar: updateProduct.avatar,
      description: updateProduct.description,
      userId: updateProduct.user.id
    };
    return updateProduct;
  }
}
