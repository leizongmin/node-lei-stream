/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

/** 当前版本 */
export const version: string;

/** 流或文件名 */
export type ReadStream = string | NodeJS.ReadableStream | NodeJS.ReadWriteStream;
export type WriteStream = string | NodeJS.WritableStream | NodeJS.ReadWriteStream;

/** 数据编码方法 */
export type EncodingMethod = 'json' | 'base64' | ((data: string | buffer) => string | Buffer);

export interface ReadLineStreamOptions {
  /** 换行符 */
  newline?: string;
  /** 是否自动读取下一行 */
  autoNext?: boolean;
  /** 是否将数据转换为字符串 */
  toString?: boolean;
  /** 数据编码方法 */
  encoding?: EncodingMethod;
}

export interface ReadLineStream extends NodeJS.EventEmitter {

  new(stream: ReadStream, options?: ReadLineStreamOptions): ReadLineStream;

  /**
   * 出错
   */
  on(event: 'error', callback: (err: Error) => void): void;

  /**
   * 读取到一行数据
   */
  on(event: 'data',  callback: (data: string | Buffer) => void): void;

  /**
   * 流已经结束
   */
  on(event: 'end',  callback: () => void): void;

  /**
   * 读取下一行
   */
  next(): void;

  /**
   * 关闭
   */
  close(): void;
}

/**
 * 按行读取流数据
 */
export function readLine(stream: ReadStream, options?: ReadLineStreamOptions): ReadableStream;

export interface WriteLineStreamOptions {
  /** 换行符 */
  newline?: string;
  /** 数据编码方法 */
  encoding?: EncodingMethod;
  /** 缓存的行数 */
  cacheLines?: number;
}

export interface WriteLineStream extends NodeJS.EventEmitter {

  new(stream: WriteStream, options?: WriteLineStreamOptions): WriteLineStream;

  /**
   * 出错
   */
  on(event: 'error', callback: (err: Error) => void): void;

  /**
   * 写数据
   */
  write(data: string | Buffer, callback?: (err?: Error) => void): boolean;

  /**
   * 将缓冲的数据写入目标
   */
  flush(callback?: () => void): void;

  /**
   * 结束
   */
  end(): void;
}

/**
 * 按行写数据到流
 */
export function writeLine(stream: WriteStream, options?: WriteLineStreamOptions): WriteLineStream;

export interface TailStreamOptions {
  /** 文件名 */
  file: string;
  /** 开始位置 */
  position?: number | 'end';
}

export interface TailStream extends NodeJS.ReadableStream {

  new(options: TailStreamOptions): TailStream;

  /**
   * 关闭
   */
  close(): void;
}

/**
 * 监听文件新增内容变化的流
 */
export function tailStream(file: string, options: TailStreamOptions): TailStream;
