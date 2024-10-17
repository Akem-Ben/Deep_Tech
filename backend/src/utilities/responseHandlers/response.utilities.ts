import { Response } from "express";

/**
 * Response Handler:
 * This function sends a standardized JSON response to the client. It includes the status code, status, message,
 * and optional info and data fields in the response.
 * It is used for sending out success responses from the backend to the frontend/user/client.
 *
 * @param {Response} response - The response object used to send the response.
 * @param {string} message - The message to be included in the response.
 * @param {any} [data] - Optional data to include in the response.
 * @returns {Response} - The response object with the JSON payload.
 */

const responseHandler = (
  response: Response,
  message: string,
  statusCode: number,
  details?: any,
  data?: any,
) => {

  return response.status(statusCode).json({
    status: statusCode === 201 || statusCode === 200 ? "success" : "error",
    message: message,
    data: data || null,
    details
  });
};

export default {
  responseHandler,
};
