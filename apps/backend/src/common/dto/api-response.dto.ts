export class ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;

  constructor(data: T, message?: string, path?: string) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.path = path || '';
  }
}

export class ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
  statusCode: number;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: any,
    path?: string
  ) {
    this.success = false;
    this.error = {
      code,
      message,
      details,
    };
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = path || '';
  }
}

export class ValidationErrorResponse extends ApiErrorResponse {
  constructor(errors: any[], path?: string) {
    super(
      400,
      'VALIDATION_ERROR',
      'Request validation failed',
      errors,
      path
    );
  }
}

export class DomainErrorResponse extends ApiErrorResponse {
  constructor(message: string, path?: string) {
    super(
      400,
      'DOMAIN_ERROR',
      message,
      undefined,
      path
    );
  }
}

export class NotFoundErrorResponse extends ApiErrorResponse {
  constructor(resource: string, path?: string) {
    super(
      404,
      'NOT_FOUND',
      `${resource} not found`,
      undefined,
      path
    );
  }
}

export class UnauthorizedErrorResponse extends ApiErrorResponse {
  constructor(message: string = 'Unauthorized access', path?: string) {
    super(
      401,
      'UNAUTHORIZED',
      message,
      undefined,
      path
    );
  }
}

export class ForbiddenErrorResponse extends ApiErrorResponse {
  constructor(message: string = 'Forbidden access', path?: string) {
    super(
      403,
      'FORBIDDEN',
      message,
      undefined,
      path
    );
  }
}

export class InternalServerErrorResponse extends ApiErrorResponse {
  constructor(message: string = 'Internal server error', path?: string) {
    super(
      500,
      'INTERNAL_SERVER_ERROR',
      message,
      undefined,
      path
    );
  }
}

