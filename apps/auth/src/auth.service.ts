import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto, AuthResponseDto } from '@kino-app/common/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import {User} from "@kino-app/db/entities/user.entity";
import {RedisStorageService} from "@kino-app/redis-storage/redis-storage.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisStorageService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(user);
    const token = uuid.v4();
    await this.redisService.set(
      `session:${token}`,
      JSON.stringify({
        userId: savedUser.id,
        email: savedUser.email,
      }),
      86400,
    ); // 24 hours

    // Cache user email for notifications service
    await this.redisService.set(
      `user:email:${savedUser.id}`,
      savedUser.email,
      86400,
    ); // 24 hours

    return {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = uuid.v4();
    await this.redisService.set(
      `session:${token}`,
      JSON.stringify({
        userId: user.id,
        email: user.email,
      }),
      86400,
    ); // 24 hours

    await this.redisService.set(`user:email:${user.id}`, user.email, 86400); // 24 hours

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
