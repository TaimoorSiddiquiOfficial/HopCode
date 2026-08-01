export class Instance {
    static state(init) {
        let data;
        return async () => {
            if (!data)
                data = await init();
            return data;
        };
    }
}
//# sourceMappingURL=instance.js.map