import { ComposedStorage, Documents, Events, IPFSAccessController, IPFSBlockStorage, KeyValue, KeyValueIndexed, LRUStorage, LevelStorage, MemoryStorage, OrbitDBAccessController, createOrbitDB } from '@orbitdb/core';

export interface DatabaseConfig {
    address: string; // The address of an existing database to open, or the name of a new database.
    params: {
      type: "event"|"documents"|"keyvalue"; // <optional> The database's type.
      meta?: any; // <optional> The database's metadata. Only applies when creating a database and is not used when opening an existing database.
      sync?: boolean; // <optional> If true, sync databases automatically. Otherwise, false.
      Database?: Documents|Events|KeyValueIndexed|KeyValue; // <optional> A Database-compatible module.
      AccessController?: IPFSAccessController|OrbitDBAccessController; // <optional> An AccessController-compatible module.
      headsStorage?: IPFSBlockStorage|LevelStorage|ComposedStorage|LRUStorage|MemoryStorage; // <optional> A compatible storage instance for storing log heads. Defaults to ComposedStorage(LRUStorage, LevelStorage).
      entryStorage?: IPFSBlockStorage|LevelStorage|ComposedStorage|LRUStorage|MemoryStorage; // <optional> A compatible storage instance for storing log entries. Defaults to ComposedStorage(LRUStorage, IPFSBlockStorage).
      indexStorage?: IPFSBlockStorage|LevelStorage|ComposedStorage|LRUStorage|MemoryStorage; // <optional> A compatible storage instance for storing an " index of log entries. Defaults to ComposedStorage(LRUStorage, LevelStorage).
      referencesCount?: number; // <optional> The number of references to use for Log entries.
    };
  }
  


export const createOrbitdb = async (ipfs:any,id:string) => {
    const orbitdb = await createOrbitDB({ipfs, id});
    console.log(orbitdb);
    return await orbitdb;
}
// 打开指定的数据库
export const openDatabase = async (orbitdb:any, address:string) => {
    try {
        const db = await orbitdb.open(address);
        return db;
    } catch (error:any) {
        throw new Error(`Failed to open database: ${error.message}`);
    }
}