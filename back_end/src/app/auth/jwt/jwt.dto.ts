export interface JwtPayload {
  userId: number;
}

export interface JwtRequest extends Request {
  user: JwtPayload;
}
