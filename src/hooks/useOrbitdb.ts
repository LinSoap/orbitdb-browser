import { useState } from 'react';
import { useIpfs } from './useIpfs';
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


export const useOrbitDB = () => {
  const [orbitDB, setOrbitDB] = useState<any>(null);
  const [error, setError] = useState('');
  const ipfs = useIpfs();

  const initOrbitdb = async () => {
    if (ipfs) {
      try {
        const orbitdbInstance = await createOrbitDB(ipfs, 'LinSoap');
        console.log('OrbitDB instance:', orbitdbInstance);
        setOrbitDB(orbitdbInstance);
      } catch (error: any) {
        setError(`Error creating OrbitDB: ${error.message}`);
      }
    }
  };
  
  return { orbitDB, error ,initOrbitdb};
};
