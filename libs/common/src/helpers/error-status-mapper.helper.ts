// src/helpers/error-status-mapper.helper.ts
import { HttpStatus } from '@nestjs/common';

export class ErrorStatusMapper {
  grpcToHttpMapper(grpcCode: number): HttpStatus {
    // Map gRPC error codes to HTTP status codes
    switch (grpcCode) {
      case 0: // OK
        return HttpStatus.OK;
      case 1: // CANCELLED
        return HttpStatus.REQUEST_TIMEOUT;
      case 2: // UNKNOWN
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case 3: // INVALID_ARGUMENT
        return HttpStatus.BAD_REQUEST;
      case 4: // DEADLINE_EXCEEDED
        return HttpStatus.REQUEST_TIMEOUT;
      case 5: // NOT_FOUND
        return HttpStatus.NOT_FOUND;
      case 6: // ALREADY_EXISTS
        return HttpStatus.CONFLICT;
      case 7: // PERMISSION_DENIED
        return HttpStatus.FORBIDDEN;
      case 8: // FAILED_PRECONDITION
        return HttpStatus.PRECONDITION_FAILED;
      case 9: // ABORTED
        return HttpStatus.CONFLICT;
      case 10: // OUT_OF_RANGE
        return HttpStatus.BAD_REQUEST;
      case 11: // UNIMPLEMENTED
        return HttpStatus.NOT_IMPLEMENTED;
      case 12: // INTERNAL
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case 13: // UNAVAILABLE
        return HttpStatus.SERVICE_UNAVAILABLE;
      case 14: // DATA_LOSS
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
