export function lazy(fn) {
    let promise;
    const result = () => {
        if (!promise)
            promise = fn();
        return promise;
    };
    result.reset = () => {
        promise = undefined;
    };
    return result;
}
//# sourceMappingURL=lazy.js.map