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

export interface IdentitiesInstance {
    createIdentity: (options?: Record<string, any>) => Promise<any>;
    verifyIdentity: (identity: any) => Promise<boolean>;
    getIdentity: (hash: string) => Promise<any>;
    sign: (identity: any, data: any) => Promise<string>;
    verify: (signature: string, publicKey: string, data: any) => Promise<boolean>;
    keystore: {
      clear: () => void;
      close: () => void;
      hasKey: (key: string) => boolean;
      addKey: (key: string, value: any) => void;
      createKey: (key: string) => any;
      [key: string]: any;
    };
    [key: string]: any;
  }