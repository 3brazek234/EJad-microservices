import jwt from 'jsonwebtoken';
import { json, NextFunction, Request, Response } from 'express';
import { InternalServerError, UnauthorizedError } from './error-handler';
// its a middleware to ensure that the request to other services except api-gateway is coming from api-gateway
const tokens: string[] = [
  'auth',
  'seller',
  'gig',
  'search',
  'message',
  'order',
  'review',
  'buyer',
];
export const verifyGatewayRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.gatewayToken) {
    throw new UnauthorizedError('Request must comes from api-gateway service');
  }
  const token: string = req.headers.gatewayToken as string;
  if (!token) {
    throw new UnauthorizedError('Request must comes from api-gateway service');
  }
  try {
    const payload: { id: string; iat: number } = jwt.verify(
      token,
      'secret jwt'
    ) as { id: string; iat: number };
    if (!tokens.includes(payload.id)) {
      throw new UnauthorizedError(
        'Request must comes from api-gateway service'
      );
    }
  } catch (error) {
    throw InternalServerError;
  }
};
 