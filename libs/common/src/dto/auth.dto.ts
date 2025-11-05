export class RegisterDto {
  email: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
