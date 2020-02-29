import { Injectable } from "@nestjs/common";
const redis = require("redis");

@Injectable()
export class RedisService {
    client: any;
    constructor () {
      this.client = redis.createClient();
    }

    async get (key) {
      return new Promise(resolve => {
        this.client.get(key, function (er, reply) {
          resolve(reply);
        });
      });
    }

    async set (key, value) {
      return new Promise(resolve => {
        resolve(this.client.set(key, value));
      });
    }

    async incr (key) {
      return new Promise(resolve => {
        resolve(this.client.incr(key));
      });
    }

    async decr (key) {
      return new Promise(resolve => {
        resolve(this.client.decr(key));
      });
    }
}
