import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

interface AuthGrpcService {
  validateUser(data: { token: string }): any;
}

@Injectable()
export class GrpcService implements OnModuleInit {
  private authService: AuthGrpcService;

  onModuleInit() {
    // gRPC client setup (for future use)
    // In production, this would be used to call Auth service for user data
    const protoPath = join(
      __dirname,
      '../../../libs/common/src/proto/auth.proto',
    );
    const client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: protoPath,
        url: process.env.AUTH_GRPC_URL || 'localhost:5001',
      },
    });

    this.authService = client.getService<AuthGrpcService>('UsersService');
  }


  async getUserEmail(token: string): Promise<string | null> {
    try {
      const result = await this.authService.validateUser({ token }).toPromise();
      if (result && result.valid && result.email) {
        return result.email;
      }
      return null;
    } catch (error) {
      console.error('Error calling gRPC validateUser:', error);
      return null;
    }
  }
}
