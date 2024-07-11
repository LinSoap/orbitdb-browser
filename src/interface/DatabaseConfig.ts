import {
    ComposedStorage,
    Documents,
    Events,
    IPFSAccessController,
    IPFSBlockStorage,
    KeyValue,
    KeyValueIndexed,
    LRUStorage,
    LevelStorage,
    MemoryStorage,
    OrbitDBAccessController,
  } from "@orbitdb/core";

export interface DatabaseConfig {
    address: string; // The address of an existing database to open, or the name of a new database.
    params: {
      type: "events" | "documents" | "keyvalue"; // <optional> The database's type.
      meta?: any; // <optional> The database's metadata. Only applies when creating a database and is not used when opening an existing database.
      sync?: boolean; // <optional> If true, sync databases automatically. Otherwise, false.
      Database?: Documents | Events | KeyValueIndexed | KeyValue; // <optional> A Database-compatible module.
      AccessController?: IPFSAccessController | OrbitDBAccessController; // <optional> An AccessController-compatible module.
      headsStorage?:
        | IPFSBlockStorage
        | LevelStorage
        | ComposedStorage
        | LRUStorage
        | MemoryStorage; // <optional> A compatible storage instance for storing log heads. Defaults to ComposedStorage(LRUStorage, LevelStorage).
      entryStorage?:
        | IPFSBlockStorage
        | LevelStorage
        | ComposedStorage
        | LRUStorage
        | MemoryStorage; // <optional> A compatible storage instance for storing log entries. Defaults to ComposedStorage(LRUStorage, IPFSBlockStorage).
      indexStorage?:
        | IPFSBlockStorage
        | LevelStorage
        | ComposedStorage
        | LRUStorage
        | MemoryStorage; // <optional> A compatible storage instance for storing an " index of log entries. Defaults to ComposedStorage(LRUStorage, LevelStorage).
      referencesCount?: number; // <optional> The number of references to use for Log entries.
    };
  }