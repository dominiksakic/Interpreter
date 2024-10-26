import Scanner from "./Scanner";
import Token from "./Token";

class Lox {
  static hadError = false;

  static async main(args: string[]) {
    if (args.length > 1) {
      console.log("Usage: tlox [script]");
      Deno.exit(64);
    } else if (args.length === 1) {
      const filePath = args[0];
      try {
        const data = await Deno.readTextFile(filePath);
        this.run(data);
      } catch (error) {}
      console.log("running file");
    } else {
      this.runPrompt();
    }
  }

  static async runPrompt(): Promise<void> {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const buffer = new Uint8Array(1024);

    while (true) {
      await Deno.stdout.write(encoder.encode(">"));

      const n = <number>await Deno.stdin.read(buffer);
      if (n === 1) break;

      const input = decoder.decode(buffer.subarray(0, n)).trim();
      if (input === "exit") break;

      this.run(input);
      this.hadError = false;
    }
    Deno.exit(64);
  }

  static run(source: string): void {
    const scanner = new Scanner(source);
    const tokens: Token[] = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token);
    }
  }
  static error(line: number, message: string): void {
    this.report(line, "", message);
  }

  static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }
}

Lox.main(Deno.args);

export default Lox;
