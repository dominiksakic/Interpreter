class Lox {
  static async main(args: string[]) {
    if (args.length > 1) {
      console.log("Usage: tlox [script]");
      Deno.exit(65);
    } else if (args.length === 1) {
      const filePath = args[0];
      try {
        const data = await Deno.readTextFile(filePath);
        console.log("File data: ", data);
      } catch (error) {
      }
      console.log("running file");
    } else {
      console.log("run repl");
    }
  }
}

Lox.main(Deno.args);
