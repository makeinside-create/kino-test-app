import {Injectable} from '@nestjs/common';
import {RedisStorageService} from "@kino-app/redis-storage/redis-storage.service";

@Injectable()
export class UsersService {
  constructor(
    private redisService: RedisStorageService,
  ) {
  }

  async validateUser(
    token: string,
  ): Promise<{ userId: number; email: string } | null> {
    const sessionData = await this.redisService.get(`session:${token}`);
    if (!sessionData) {
      return null;
    }
    return JSON.parse(sessionData) as { userId: number; email: string };
  }
}
