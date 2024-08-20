import { RpcException } from '@nestjs/microservices';
import { ErrorStatusMapper } from '../helpers/error-status-mapper.helper';
import { IExceptionResponse } from '../interface/exception-response.interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

export const EXCEPTION_LIST = [Error, RpcException,HttpException];
@Catch(...EXCEPTION_LIST)
export class GrpcExceptionFilter implements ExceptionFilter {
  private logger = new Logger('GRPC');
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // console.log('GRPC EXCEPTION', exception);

    let res: IExceptionResponse, statusCode: HttpStatus;
    const mapper: ErrorStatusMapper = new ErrorStatusMapper();

    try {
      const code =
        'code' in exception ? exception?.code : exception?.error?.code;
      statusCode = code
        ? mapper.grpcToHttpMapper(code)
        : exception.response?.statusCode || 500;

      let message =
        exception?.response?.message?.[0] ||
        (exception?.details?.includes('message')
          ? JSON.parse(exception.details).message
          : exception?.details) ||
        (exception?.error?.message?.includes('message')
          ? JSON.parse(exception.error.message).message
          : exception?.error?.message) ||
        exception?.cause?.message ||
        exception.message ||
        exception;
      console.log('mes', exception.message);
      if (typeof message === 'string') {
        try {
          const parsedMessage = JSON.parse(message);
          if (parsedMessage.error) {
            message = parsedMessage.error;
          }
        } catch {
          // Không thể phân tích chuỗi JSON, giữ thông báo lỗi gốc
        }
      }
      res = {
        statusCode,
        message: message,
        type: HttpStatus[statusCode],
      };
    } catch {
      res = {
        statusCode: 500,
        message: 'Internal Server Error',
        type: HttpStatus[500],
      };
    }
    response.status(res.statusCode).send({ ...res });
  }
}