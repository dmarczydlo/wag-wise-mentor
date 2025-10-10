import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiErrorResponse,
  ValidationErrorResponse,
  NotFoundErrorResponse,
  UnauthorizedErrorResponse,
  ForbiddenErrorResponse,
  InternalServerErrorResponse,
  DomainErrorResponse,
} from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url;

    let errorResponse: ApiErrorResponse;

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      
      if (exceptionResponse.message === 'Validation failed' && exceptionResponse.errors) {
        errorResponse = new ValidationErrorResponse(
          exceptionResponse.errors,
          path
        );
      } else {
        errorResponse = new DomainErrorResponse(
          exceptionResponse.message || exception.message,
          path
        );
      }
    } else if (exception instanceof NotFoundException) {
      const exceptionResponse = exception.getResponse() as any;
      const message = exceptionResponse.message || exception.message;
      errorResponse = new NotFoundErrorResponse(message, path);
    } else if (exception instanceof UnauthorizedException) {
      const exceptionResponse = exception.getResponse() as any;
      const message = exceptionResponse.message || exception.message;
      errorResponse = new UnauthorizedErrorResponse(message, path);
    } else if (exception instanceof ForbiddenException) {
      const exceptionResponse = exception.getResponse() as any;
      const message = exceptionResponse.message || exception.message;
      errorResponse = new ForbiddenErrorResponse(message, path);
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      const message = exceptionResponse.message || exception.message;
      
      errorResponse = new ApiErrorResponse(
        status,
        `HTTP_${status}`,
        message,
        undefined,
        path
      );
    } else {
      const error = exception as Error;
      console.error('Unhandled exception:', error);
      
      errorResponse = new InternalServerErrorResponse(
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : error.message,
        path
      );
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}

