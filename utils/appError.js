class appError extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
    this.message = message;
  }
}

export default new appError();
