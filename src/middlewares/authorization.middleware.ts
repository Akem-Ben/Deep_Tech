import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const generalAuthFunction = async (
  request: JwtPayload,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return response.status(401).json({
        message: 'No Authorization header provided',
      });
    }

    const authorizationToken = authorizationHeader.split(' ')[1];

    if (!authorizationToken) {
      return response.status(401).json({
        status: 'Failed',
        message: 'Login required',
      });
    }

    const verifiedUser = jwt.verify(authorizationToken, `${process.env.APP_SECRET}`);

    if (!verifiedUser) {
      return response.status(401).json({
        status: 'error',
        message: 'Invalid Token',
      });
    }

    request.user = verifiedUser;
    
    next();

  } catch (error: any) {
    if (error.message === 'jwt expired') {
      return response.status(401).json({
        status: 'error',
        message: 'Access Token Expired. Please Refresh the token.',
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
