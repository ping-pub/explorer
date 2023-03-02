export declare const createLCDClient: ({ restEndpoint }: {
    restEndpoint: string;
}) => Promise<{
    cosmos: {
        auth: {
            v1beta1: import("./auth/v1beta1/query.lcd").LCDQueryClient;
        };
        authz: {
            v1beta1: import("./authz/v1beta1/query.lcd").LCDQueryClient;
        };
        bank: {
            v1beta1: import("./bank/v1beta1/query.lcd").LCDQueryClient;
        };
        base: {
            tendermint: {
                v1beta1: import("./base/tendermint/v1beta1/query.lcd").LCDQueryClient;
            };
        };
        distribution: {
            v1beta1: import("./distribution/v1beta1/query.lcd").LCDQueryClient;
        };
        evidence: {
            v1beta1: import("./evidence/v1beta1/query.lcd").LCDQueryClient;
        };
        feegrant: {
            v1beta1: import("./feegrant/v1beta1/query.lcd").LCDQueryClient;
        };
        gov: {
            v1: import("./gov/v1/query.lcd").LCDQueryClient;
            v1beta1: import("./gov/v1beta1/query.lcd").LCDQueryClient;
        };
        group: {
            v1: import("./group/v1/query.lcd").LCDQueryClient;
        };
        mint: {
            v1beta1: import("./mint/v1beta1/query.lcd").LCDQueryClient;
        };
        nft: {
            v1beta1: import("./nft/v1beta1/query.lcd").LCDQueryClient;
        };
        params: {
            v1beta1: import("./params/v1beta1/query.lcd").LCDQueryClient;
        };
        slashing: {
            v1beta1: import("./slashing/v1beta1/query.lcd").LCDQueryClient;
        };
        staking: {
            v1beta1: import("./staking/v1beta1/query.lcd").LCDQueryClient;
        };
        tx: {
            v1beta1: import("./tx/v1beta1/service.lcd").LCDQueryClient;
        };
        upgrade: {
            v1beta1: import("./upgrade/v1beta1/query.lcd").LCDQueryClient;
        };
    };
}>;
