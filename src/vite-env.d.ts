/// <reference types="vite/client" />
// src/orbitdb-core.d.ts
declare module '@orbitdb/core' {
  export function createOrbitDB(ipfs: any, options?: any): Promise<any>;

  export {
    Documents,
    Events,
    KeyValue,
    KeyValueIndexed,
    useDatabaseType
  } from '@orbitdb/core/src/databases/index.js';

  export {
    isValidAddress,
    parseAddress
  } from '@orbitdb/core/src/address.js';

  export { Log, Entry, DefaultAccessController } from '@orbitdb/core/src/oplog/index.js';

  export { default as Database } from '@orbitdb/core/src/database.js';

  export { default as KeyStore } from '@orbitdb/core/src/key-store.js';

  export {
    useAccessController,
    IPFSAccessController,
    OrbitDBAccessController
  } from '@orbitdb/core/src/access-controllers/index.js';

  export {
    Identities,
    isIdentity,
    useIdentityProvider,
    PublicKeyIdentityProvider
  } from '@orbitdb/core/src/identities/index.js';

  export {
    IPFSBlockStorage,
    LevelStorage,
    LRUStorage,
    MemoryStorage,
    ComposedStorage
  } from '@orbitdb/core/src/storage/index.js';
}
