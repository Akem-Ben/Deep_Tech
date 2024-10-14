import brcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../configurations/envKeys';
import { ResponseDetails } from '../../types/utilities.types';

/**
 * Hash Password:
 * This function hashes a given password using bcrypt with a salt factor of 5.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - Throws an error if there is an issue with hashing the password.
 */

const hashPassword = async (password: string): Promise<string> => {
  const salt = await brcrypt.genSalt(5);
  const passwordHash = await brcrypt.hash(password, salt);
  return passwordHash;
};

/**
 * Validate Password:
 * This function compares a given password with a hashed user password using bcrypt.
 * @param {string} password - The password to be validated.
 * @param {string} userPassword - The hashed user password to compare against.
 * @returns {Promise<boolean>} - Returns true if the password matches, otherwise false.
 * @throws {Error} - Throws an error if there is an issue with validating the password.
 */

const validatePassword = async (
  password: string,
  userPassword: string,
): Promise<boolean> => {
  return await brcrypt.compare(password, userPassword);
};

/**
 * Generate Token:
 * This function generates a JSON Web Token (JWT) with a given payload and an expiration time of 15 hours.
 * @param {Record<string, string>} payload - The payload to be included in the token.
 * @returns {Promise<string>} - The generated token.
 * @throws {Error} - Throws an error if there is an issue with generating the token.
 */

const generateTokens = async (
  payload: Record<string, string>,
  expiresIn: string,
) => {
  return jwt.sign(payload, `${APP_SECRET}`, { expiresIn: expiresIn });
};

/**
 * Verify Token:
 * This function verifies a given JSON Web Token (JWT) using the application secret.
 * @param {string} token - The token to be verified.
 * @returns {Promise<object>} - The decoded token payload if verification is successful.
 * @throws {Error} - Throws an error if there is an issue with verifying the token.
 */

// const verifyToken = async (token: string) => {
//   try {
//     return jwt.verify(token, `${APP_SECRET}`);
//   } catch (error: any) {
//     if (error.message === 'jwt expired') {
//       let responseDetails: ResponseDetails = {
//         statusCode: 0,
//         message: '',
//       };
//       responseDetails.statusCode = 500;
//       responseDetails.message = 'Please request verification email again';
//       return responseDetails;
//     }
//   }
// }; 



const refreshUserToken = async (
    userRefreshToken: string
  ) => {
    try{
        let responseDetails: ResponseDetails = {
            statusCode: 0,
            message: '',
        };
    const decodedToken:any = jwt.verify(userRefreshToken, `${APP_SECRET}`);

    if (!decodedToken) {
        responseDetails.statusCode = 401;
        responseDetails.message = 'Invalid Refresh Token';
        return responseDetails;
      }

      const userPayload = {
        id: decodedToken.id,
        email: decodedToken.email,
      }

      const newAccessToken = await generateTokens(userPayload, '3h')
      const newRefreshToken = await generateTokens(userPayload, '30d')

      responseDetails.statusCode = 200;
      responseDetails.message = 'Refresh Token is valid, new tokens generated';
      responseDetails.data = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
    return responseDetails;

    }catch (error: any) {
        if (error.message === 'jwt expired') {
          let responseDetails: ResponseDetails = {
            statusCode: 0,
            message: '',
          };
          responseDetails.statusCode = 403;
          responseDetails.message = 'Please login again';
          return responseDetails;
        }
      }
  };



export default {
  hashPassword,
  validatePassword,
  generateTokens,
  refreshUserToken,
};
