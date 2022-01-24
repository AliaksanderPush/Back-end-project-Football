module.exports = class ApiError extends Error {
  status;
  errors;
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static Unouthorizederror() {
    return new ApiError(401, "The user is not registered");
  }
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};
