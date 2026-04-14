import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiration: string;
}

export const jwtConfig = registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET as string,
  expiration: process.env.JWT_EXPIRATION as string,
}));