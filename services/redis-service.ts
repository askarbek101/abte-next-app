// src/services/redis-service.ts
import { Redis } from '@upstash/redis';
import { env } from 'process';

class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    console.log('Redis service initialized');
    this.client = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async create(key: string, value: any): Promise<void> {
    await this.client.set(key, value);
  }

  public async read(key: string): Promise<any> {
    return await this.client.get(key);
  }

  public async update(key: string, value: any): Promise<void> {
    await this.client.set(key, value);
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  // add method read sync
  public readSync(key: string): any {
      return this.client.get(key);
  }
}

export const runtime = 'edge';

export default RedisService;
