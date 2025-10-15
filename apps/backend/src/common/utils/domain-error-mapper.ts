import { HttpStatus } from "@nestjs/common";

export class DomainErrorMapper {
  static mapToHttpStatus(code: string): HttpStatus {
    switch (code) {
      case "VALIDATION_ERROR":
        return HttpStatus.BAD_REQUEST;
      case "NOT_FOUND":
        return HttpStatus.NOT_FOUND;
      case "UNAUTHORIZED":
        return HttpStatus.UNAUTHORIZED;
      case "FORBIDDEN":
        return HttpStatus.FORBIDDEN;
      case "CONFLICT":
        return HttpStatus.CONFLICT;
      case "INTERNAL_ERROR":
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
