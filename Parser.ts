import TokenType from "./TokenType";
import Token from "./Token";
import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr } from "./Expr";

class Parser {
  current: number = 0;
  tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
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

    if (this.match(TokenType.LEFT_PAREN)) {
      let expr: Expr = this.expression();
      //this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new GroupingExpr(expr);
    }
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

  private previous() {
    return this.tokens[this.current - 1];
  }
}
