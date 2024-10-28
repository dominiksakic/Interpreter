class GeneratAST {
  private static content: string;

  static main(args: string[]) {
    if (args.length !== 1) {
      console.log("Usage: generateAST <output directory>");
      Deno.exit(64);
    }

    const outputDir = args[0];
    this.defineAST(outputDir, "Expr", [
      "Binary   : left Expr, operator Token, right Expr",
      "Grouping : expression Expr",
      "Literal  : value Object",
      "Unary    : operator Token, right Expr",
    ]);
  }

  private static async defineAST(
    outputDir: string,
    baseName: string,
    types: string[],
  ) {
    const filePath = `${outputDir}/${baseName}.ts`;
    const encoder = new TextEncoder();

    this.content = `//Autogenerated AST by defineAST\n\n`;
    this.content += `import Token from "./Token.ts";\n`;
    this.content += `abstract class ${baseName} {\n`;

    for (const type of types) {
      const className = type.split(":")[0].trim();
      const types = type.split(":")[1].trim();
    }
    this.content += `}\n\n`;
    const data = encoder.encode(this.content);
    await Deno.writeFile(filePath, data);
  }
}

GeneratAST.main(Deno.args);
