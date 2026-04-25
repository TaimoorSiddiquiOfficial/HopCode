declare module '@lydell/node-pty' {
  export interface IPty {
    onData(callback: (data: string) => void): void;
    onExit(
      callback: (exitCode: { exitCode: number; signal?: number }) => void,
    ): void;
    write(data: string): void;
    resize(columns: number, rows: number): void;
    kill(): void;
    pid: number;
    cols: number;
    rows: number;
  }

  export function createPty(
    file: string,
    args: string[],
    options: {
      name?: string;
      cols?: number;
      rows?: number;
      cwd?: string;
      env?: Record<string, string>;
      uid?: number;
      gid?: number;
    },
  ): IPty;
}
