import { Expr } from "./Expr";

interface Visitor<T> {
  visitPrintStmt(Print: Stmt): T;
  visitExprStmt(Expr: Stmt): T;
}
abstract class Stmt {
  abstract accept<T>(visitor: Visitor<T>): T;
}

class ExprStmt extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitExprStmt(this);
  }
}

class PrintStmt extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitPrintStmt(this);
  }
}

export { PrintStmt, ExprStmt, Stmt };
