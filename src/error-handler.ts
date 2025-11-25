import { StatusCodes } from 'http-status-codes';
export interface IErrorResponse {
  message: string;
  statusCode: number;
  status?: string;
  comimgFrom: string;
  serializeError(): IError;
}
export interface IError {
  message: string;
  statusCode: number;
  status?: string;
  comimgFrom: string;
}
export abstract class CustomError extends Error implements IErrorResponse {
  // must be implemented by subclasses
  abstract statusCode: number;
  abstract status: string;
  comimgFrom: string;

  constructor(message: string, comimgFrom: string) {
    super(message);
    this.comimgFrom = 'CustomError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
  serializeError(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      comimgFrom: this.comimgFrom,
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode: number;
  status: string;
  constructor(message: string) {
    super(message, 'BadRequestError');
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.status = 'badRequest';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class NotFoundError extends CustomError {
  statusCode: number;
  status: string;
  constructor(message: string) {
    super(message, 'NotFoundError');
    this.statusCode = StatusCodes.NOT_FOUND;
    this.status = 'notFound';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class UnauthorizedError extends CustomError {
  statusCode: number;
  status: string;
  constructor(message: string) {
    super(message, 'UnauthorizedError');
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = 'unauthorized';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ForbiddenError extends CustomError {
  statusCode: number;
  status: string;
  constructor(message: string) {
    super(message, 'ForbiddenError');
    this.statusCode = StatusCodes.FORBIDDEN;
    this.status = 'forbidden';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class InternalServerError extends CustomError {
  statusCode: number;
  status: string;
  constructor(message: string) {
    super(message, 'InternalServerError');
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.status = 'internalServerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export interface ErrorException extends Error {
  error: number;
  code: string;
  path: string;
  syscall: string;
  stack: string;
}
