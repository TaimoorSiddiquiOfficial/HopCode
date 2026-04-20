export function lazy<T>(fn: () => Promise<T>) {
  let promise: Promise<T> | undefined;
  const result = () => {
    if (!promise) promise = fn();
    return promise;
  };
  result.reset = () => {
    promise = undefined;
  };
  return result;
}
