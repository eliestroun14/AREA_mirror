import { IsEmail, IsString } from 'class-validator';
import { UserDTO } from '@app/users/users.dto';

//  Sign In
export class SignInBody {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

//  Sign Up
export class SignUpBody {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}

export type SignUpResponse = UserDTO;
