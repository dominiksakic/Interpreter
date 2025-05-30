import TokenType from "./TokenType.ts";
import Token from "./Token.ts";
import {
  BinaryExpr,
  Expr,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
  VariableExpr,
} from "./Expr.ts";
import Lox from "./main.ts";
import { ExprStmt, PrintStmt, Stmt, VarStmt } from "./Stmt.ts";

class ParseError extends Error {
  constructor(message?: string) {
    super(message);
    this.message = "ParseError";
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}

class Parser {
  current: number = 0;
  tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Stmt[] {
    let statements: Stmt[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  private match(...types: TokenType[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private expression(): Expr {
    return this.equality();
  }

  private declaration(): Stmt {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();

      return this.statement();
    } catch (ParseError) {
      this.synchronize();
    }
  }

  private statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement();

    return this.expressionStatement();
  }

  private printStatement(): Stmt {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new PrintStmt(value);
  }

  private varDeclaration(): Stmt {
    let name: Token = this.consume(
      TokenType.IDENTIFIER,
      "Expect Variable name.",
    );

    let initializer: Expr | null = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new VarStmt(name, initializer);
  }

  private expressionStatement(): Stmt {
    let expr: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new ExprStmt(expr);
  }

  private equality(): Expr {
    let expr = this.comparsion();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator: Token = this.previous();
      let right = this.comparsion();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }
  private comparsion(): Expr {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      let operator = this.previous();
      let right = this.term();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private term(): Expr {
    let expr = this.factor();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expr {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator: Token = this.previous();
      let right: Expr = this.unary();
      expr = new BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator: Token = this.previous();
      let right: Expr = this.unary();
      return new UnaryExpr(operator, right);
    }

    return this.primary();
  }

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) return new LiteralExpr(false);
    if (this.match(TokenType.TRUE)) return new LiteralExpr(true);
    if (this.match(TokenType.NIL)) return new LiteralExpr(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new LiteralExpr(this.previous().literal);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new VariableExpr(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      let expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new GroupingExpr(expr);
    }

    throw this.error(this.peek(), "Expect expression.");
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();

    throw this.error(this.peek(), message);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  private peek() {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private error(token: Token, message: string) {
    Lox.parseError(token, message);
    return new ParseError();
  }

  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}

export default Parser;
