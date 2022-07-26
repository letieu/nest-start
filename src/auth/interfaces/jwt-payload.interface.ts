export interface JwtPayloadInterface {
  id: number;
  role: string;
  iat?: Date;
  is2FA: boolean;
  verified?: boolean;
}
