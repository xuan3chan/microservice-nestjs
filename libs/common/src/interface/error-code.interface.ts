export interface IErrorCode {
    code: number; // gRPC error code
    message: string; // Error message
  }

  export const ErrorCode = {
    EMAIL_ALREADY_REGISTERED: { code: 6, message: 'Email already registered' },
    INTERNAL_ERROR: { code: 13, message: 'Internal server error' },
  };
  