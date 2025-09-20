import { IsEmail, IsString } from 'class-validator';

// =========
//  Sign In
// =========
export class SignInRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export type SignInResponseDto = {
  access_token: string;
};

// =========
//  Sign Up
// =========
export class SignUpRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}

export type SignUpResponseDto = {
  id: number;
  email: string;
  name: string;
};
