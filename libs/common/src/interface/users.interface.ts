// Define the User interface
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// Define the CreateUserDto interface
export interface CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// Define the FindUserRequest interface
export interface FindUserRequest {
  id: string;
}

// Define the GetAllResponse interface
export interface GetAllResponse {
  message: string;
}

// Define the UsersService interface
export interface UsersInterface {
  CreateUser(request: CreateUserDto): Promise<User>;
  FindUser(request: FindUserRequest): Promise<User>;
  GetAll(request: {}): Promise<GetAllResponse>;
}