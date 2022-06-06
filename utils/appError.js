/**
 * @brief Class handles all errors resulting from program executions
 * Displays the error message as well as the statusCode
 */
class AppError extends Error {
  /**
   * @brief Parameterized constructor, take as parameter the error message and the status code
   * @param {String} message
   * @param {Integer} statusCode
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
