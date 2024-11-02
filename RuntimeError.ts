import Token from "./Token";

class RuntimeError extends Error {
  token: Token;

  constructor(token: Token, message: string) {
    super(message);
    this.token = token;

    Object.setPrototypeOf(this, RuntimeError.prototype);
  }
}

export default RuntimeError;
