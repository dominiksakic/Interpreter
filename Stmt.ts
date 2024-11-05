import { Expr } from "./Expr.ts";

interface StmtVisitor<T> {
  visitPrintStmt(Print: Stmt): T;
  visitExprStmt(Expr: Stmt): T;
  visitVarStmt(Expr: Stmt): T;
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

class VarStmt extends Stmt {
  name: String;
  initializer: Expr;

  constructor(name: String, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitVarStmt(this);
  }
}

export { VarStmt, PrintStmt, ExprStmt, Stmt, StmtVisitor };
