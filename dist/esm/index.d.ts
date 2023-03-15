export type SkeetSplTransferParam = {
    toAddressPubkey: string;
    transferAmountLamport: number;
    tokenMintAddress: string;
    encodedFromSecretKeyString: string;
    iv: string;
    rpcUrl: string;
    decimal: number;
    returnQueryName?: string;
};
export type SkeetSolTransferParam = {
    toAddressPubkey: string;
    transferAmountLamport: number;
    encodedFromSecretKeyString: string;
    iv: string;
    rpcUrl: string;
    returnQueryName?: string;
};
export declare const SOLANA_TRANSFER_QUEUE = "skeet-solana-token-transfer";
export declare const SOLANA_TRANSFER_WORKER_DEV_URL = "http://localhost:1112/run";
export declare const SOLANA_TOKEN_MINT_ADDRESS = "So11111111111111111111111111111111111111112";
export declare const DEFAULT_RETURN_MUTATION_NAME = "solanaTransferReturn";
export declare const skeetSplTransfer: (solanaSplTransferParam: SkeetSplTransferParam) => Promise<void>;
export declare const skeetSolTransfer: (solanaSolTransferParam: SkeetSolTransferParam) => Promise<void>;
