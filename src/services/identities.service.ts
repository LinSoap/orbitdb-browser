import { Identities, KeyStore } from '@orbitdb/core';

export const createIdentities = async (params: {
    keystore?: KeyStore,
    path?: string,
    storage?: any,
    ipfs?: any
  }) => {
    return await Identities(params);
}