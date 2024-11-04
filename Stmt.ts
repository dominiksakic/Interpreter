import { Expr } from "./Expr.ts";

interface StmtVisitor<T> {
  visitPrintStmt(Print: Stmt): T;
  visitExprStmt(Expr: Stmt): T;
}
abstract class Stmt {
  abstract accept<T>(visitor: StmtVisitor<T>): T;
}

class ExprStmt extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitExprStmt(this);
  }
}

class PrintStmt extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitPrintStmt(this);
  }
}

export { PrintStmt, ExprStmt, Stmt, StmtVisitor };
