export type Signatures = {
    id: string;
    publicKey: string;
}
  
export type IdentityType = {
    id: string;
    publicKey: string;
    signatures: Signatures;
    type: string;
    sign: (identity: any, data: any) => Promise<void>;
    verify: (signature: any, publicKey: any, data: any) => Promise<void>;
    bytes: Uint8Array;
    hash: string;
}