// =========
//  Sign In
// =========
export type SignInRequestDto = {
  email: any;
  password: any;
};

export type SignInResponseDto = {
  access_token: string;
};

// =========
//  Sign Up
// =========
export type SignUpRequestDto = {
  email: any;
  name: any;
  password: any;
};

export type SignUpResponseDto = {
  id: number;
  email: string;
  name: string;
};
