import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from '@kino-app/common/users/users.service';


interface ValidateUserRequest {
  token: string;
}

interface ValidateUserResponse {
  valid: boolean;
  userId: number;
  email: string;
}

@Controller()
export class AuthGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'ValidateUser')
  async validateUser(data: ValidateUserRequest): Promise<ValidateUserResponse> {
    const user = await this.usersService.validateUser(data.token);

    if (!user) {
      return {
        valid: false,
        userId: 0,
        email: '',
      };
    }

    return {
      valid: true,
      userId: user.userId,
      email: user.email,
    };
  }
}
