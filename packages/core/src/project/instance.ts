export class Instance {
  static state<T>(init: () => Promise<T>) {
    let data: T | undefined;
    return async () => {
      if (!data) data = await init();
      return data;
    };
  }
}
