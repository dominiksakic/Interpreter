class Lox {
  static async main(args: string[]) {
    if (args.length > 1) {
      console.log("Usage: tlox [script]");
      Deno.exit(64);
    } else if (args.length === 1) {
      const filePath = args[0];
      try {
        const data = await Deno.readTextFile(filePath);
        console.log("File data: ", data);
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

      console.log(input);
    }
    Deno.exit(64);
  }

  static error(line: number, message: string): void {
    this.report(line, "", message);
  }

  static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error ${where}: ${message}`);
  }
}

Lox.main(Deno.args);

export default Lox;
