interface LogHeader {
  success: string;
  log: string;
  warn: string;
  error: string;
}

export class Logger {
  private readonly displayName: string;
  private readonly headers: LogHeader;

  constructor(private name: string) {
    this.displayName = name.toUpperCase();
    this.headers = {
      success: `[${this.displayName} SUCCESS]`,
      log: `[${this.displayName} INFO]`,
      warn: `[${this.displayName} WARN]`,
      error: `[${this.displayName} ERROR]`,
    };
  }

  public success(message: string) {
    console.log(`${this.headers.success} ${message}`);
  }

  public log(message: string) {
    console.log(`${this.headers.log} ${message}`);
  }

  public warn(message: string) {
    console.warn(`${this.headers.warn} ${message}`);
  }

  public error(message: string) {
    console.error(`${this.headers.error} ${message}`);
  }
}
