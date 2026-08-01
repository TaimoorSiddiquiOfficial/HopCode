const credentials = {};
export const Auth = {
    async get(providerID) {
        return credentials[providerID];
    },
    async set(providerID, info) {
        credentials[providerID] = info;
    },
    async all() {
        return credentials;
    },
};
//# sourceMappingURL=auth.js.map