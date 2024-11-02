import {
  BinaryExpr,
  Expr,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
  Visitor,
} from "./Expr.ts";
import RuntimeError from "./RuntimeError.ts";
import Token from "./Token.ts";
import TokenType from "./TokenType.ts";
import Lox from "./main.ts";
export type Value = null | string | number | boolean;

class Interpreter implements Visitor<Value> {
  private checkNumberOperand(operator: Token, operand: Value) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a Number.");
  }

  private checkNumberOperands(operator: Token, left: Value, right: Value) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must both be numbers.");
  }

  public visitLiteral(expr: LiteralExpr): Value {
    return expr.value;
  }

  public visitGrouping(expr: GroupingExpr): Value {
    return this.evaluate(expr.expression);
  }

  public visitUnary(expr: UnaryExpr): Value {
    let right: Value = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
    }

    return null;
  }

  public visitBinary(expr: BinaryExpr): Value {
    let right = this.evaluate(expr.right);
    let left = this.evaluate(expr.left);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        if (Number(right) === 0)
          throw new RuntimeError(expr.operator, "Division by zero.");
        return Number(left) / Number(right);
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) * Number(right);
      case TokenType.PLUS:
        if (typeof left === "string" && typeof right === "string") {
          return String(left) + String(right);
        }
        if (typeof left === "number" && typeof right === "number") {
          return Number(left) + Number(right);
        }
        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings.",
        );
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
    return null;
  }

  private evaluate(expr: Expr): Value {
    return expr.accept(this);
  }

  private isTruthy(object: Value): boolean {
    if (object === null) return false;
    if (typeof object === "boolean") return Boolean(object);
    return true;
  }

  private isEqual(a: Value, b: Value) {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
  }

  private stringify(object: Value): string {
    if (object == null) return "nil";

    if (typeof object === "number") {
      const text = object.toString();
      if (text.endsWith(".0")) {
        return text.substring(0, text.length - 2);
      }
      return text;
    }

    return object.toString();
  }

  interpret(expr: Expr) {
    try {
      let value = this.evaluate(expr);
      console.log(this.stringify(value));
    } catch (error) {
      Lox.runtimeError(error);
    }
  }
}

export default Interpreter;
