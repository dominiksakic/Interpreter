// AstPrinter.ts
import {
  Expr,
  BinaryExpr,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
  Visitor,
} from "../Expr.ts";
import Token from "../Token.ts";
import TokenType from "../TokenType.ts";

class AstPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitBinary(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGrouping(expr: GroupingExpr): string {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteral(expr: LiteralExpr): string {
    return expr.value === null ? "nil" : expr.value.toString();
  }

  visitUnary(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    return `(${name} ${exprs.map((expr) => this.print(expr)).join(" ")})`;
  }

  public static main() {
    const expression = new BinaryExpr(
      new UnaryExpr(
        new Token(TokenType.MINUS, "-", null, 1),
        new LiteralExpr(123),
      ),
      new Token(TokenType.STAR, "*", null, 1),
      new GroupingExpr(new LiteralExpr(45.67)),
    );

    console.log(new AstPrinter().print(expression));
  }
}
AstPrinter.main();
export default AstPrinter;