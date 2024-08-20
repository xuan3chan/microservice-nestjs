import { Observable } from "rxjs";

// Define the RegisterDto interface
export interface RegisterDto {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }
  
  // Define the LoginDto interface
  export interface LoginDto {
    email: string;
    password: string;
  }

  

  
  // Define the AuthenticationService interface
  export interface AuthInterface {
    Register(request: RegisterDto): Observable<any>;
    Login(request: LoginDto): Observable<any>;
  }