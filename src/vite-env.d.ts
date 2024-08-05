/// <reference types="vite/client" />
// src/orbitdb-core.d.ts
declare module "@orbitdb/core" {
  import EventEmitter from "events";
  import type { HeliaLibp2p } from "helia";

  type DatabaseArgs = {
    ipfs: HeliaLibp2p;
    identity?: Identity;
    address: string;
    name?: string;
    access?: AccessController;
    directory?: string;
    meta?: object;
    headsStorage?: Storage;
    entryStorage?: Storage;
    indexStorage?: Storage;
    referencesCount?: number;
    syncAutomatically?: boolean;
    onUpdate?: () => void;
  };
  
  export function Database(args: { DatabaseArgs }): Promise<{
    type: string;
    name: string;
    identity: Identity;
    meta: object;
    sync: any;
    peers: any;
    addOperation: (args: {
      op: string;
      key: string | null;
      value: unknown;
    }) => Promise<string>;
    address: string;
    close(): Promise<void>;
    drop(): Promise<void>;
    events: EventEmitter;
    access: AccessControllerType;
    log: Log;
  }>;

  export type Identity = {
    id: string;
    publicKey: string;
    signatures: {
      id: string;
      publicKey: string;
    };
    type: string;
    sign: (identity: Identity, data: string) => Promise<string>;
    verify: (
      signature: string,
      publicKey: string,
      data: string
    ) => Promise<boolean>;
  };

  export type OrbitDB = {
    id: string;
    open: (
      address: string,
      OrbitDBDatabaseOptions?
    ) => ReturnType<typeof Database>;
    stop;
    ipfs;
    directory;
    keystore;
    identity: Identity;
    peerId;
  };
  export function createOrbitDB(args: {
    ipfs: HeliaLibp2p;
    directory: string;
    id?: string;
  }): Promise<OrbitDB>;

  export function useAccessController(accessController: { type: string }): void;
  export function isValidAddress(address: unknown): boolean;

  export type Log = {
    id;
    clock: Clock;
    heads: () => Promise<LogEntry[]>;
    traverse: () => AsyncGenerator<LogEntry, void, unknown>;
  };

  export function AccessControllerGenerator({
    orbitdb,
    identities,
    address,
  }: {
    orbitdb: OrbitDB;
    identities: IdentitiesType;
    address?: string;
  }): Promise<AccessController>;

  export class AccessController {
    type: string;
    address: string;
    canAppend: (entry: LogEntry) => Promise<boolean>;
  }

  export function useDatabaseType(type: { type: string }): void;

  export type IPFSAccessControllerType = {
    type: "ipfs";
    address: string;
    write: string[];
    canAppend: (entry: LogEntry) => Promise<boolean>;
  };

  export type OrbitDBAccessControllerType = {
    type: "orbitdb";
    address: string;
    write: string[];
    canAppend: (entry: LogEntry) => Promise<boolean>;
    capabilities: () => Promise<string[]>;
    get: (capability: string) => Promise<Set>;
    grant: (capability: string, key: string) => Promise<void>;
    revoke: (capability: string, key: string) => Promise<void>;
    close: () => Promise<void>;
    drop: () => Promise<void>;
    events: EventEmitter;
  }; 

  export type AccessControllerType = IPFSAccessControllerType | OrbitDBAccessControllerType;

  export function IPFSAccessController(args: {
    write: string[];
    storage?: Storage;
  }): (args: {
    orbitdb: OrbitDB;
    identities: IdentitiesType;
    address: string;
  }) => Promise<{ IPFSAccessControllerType }>;



  export function OrbitDBAccessController(args: {
    write: string[];
  }):(args: {
    orbitdb: OrbitDB;
    identities: IdentitiesType;
    address: string;
    name: string; 
  }) => Promist<{ OrbitDBAccessControllerType }>


  export function Identities(args: {keystore?: KeyStoreType, path?: string, storage?: Storage, ipfs?: HeliaLibp2p}): Promise<IdentitiesType>;
  export class IdentitiesType {
    createIdentity;
    getIdentity;
    verifyIdentity: (identity) => boolean;
    sign;
    verify;
    keystore;
  }
  export const Entry:  {
    create: (identity: Identity, id: string, payload: unknown, clock?: Clock, next?: string[], refs?: string[]) => Promise<LogEntry>;
    verify: (identities: IdentitiesType, entry: LogEntry) => Promise<boolean>;
    decode: (bytes: Uint8Array) => Promise<LogEntry>;
    isEntry: (obj: object) => boolean;
    isEqual: (a: LogEntry, b: LogEntry) => boolean;
  };
  export class Storage {
    put;
    get;
  }
  export function IPFSBlockStorage({
    ipfs: IPFS,
    pin: boolean,
  }): Promise<Storage>;
  export function LRUStorage({ size: number }): Promise<Storage>;
  export function ComposedStorage(...args: Storage[]): Promise<Storage>;
  export function MemoryStorage(): Promise<Storage>;
  export function LevelStorage({ path: string }): Promise<Storage>;

  export type OrbitDBDatabaseOptions = {
    type: string;
    AccessController?: typeof AccessControllerGenerator;
    syncAutomatically?: boolean;
  };

  export type Clock = {
    id: string;
    time: number;
  };

  export type LogEntry<T = unknown> = {
    id: string;
    payload: { op: string; key: string | null; value?: T };
    next: string[];
    refs: string[];
    clock: Clock;
    v: Number;
    key: string;
    identity: string;
    sig: string;
    hash: string;
  };

 

  export type EventsType = {
    type: "events",
    name: string;
    identity: Identity;
    meta: object;
    sync: any;
    peers: any;
    address: string;
    add(value: string): Promise<string>;
    get(key: string): Promise<string>;
    all(): Promise<{ value:string ; hash:string }[]>
    close(): Promise<void>;
    drop(): Promise<void>;
    events: EventEmitter;
    access: AccessControllerType;
    log: Log;
  };

  export function Events(args: DatabaseArgs): Promise<EventsType>;    

  export type KeyValueType = {
    type: "keyvalue";
    name: string;
    identity: Identity;
    meta: object;
    sync: any;
    peers: any;
    address: string;
    put(key: string, value: unknown): Promise<string>;
    set: KeyValue["put"];
    del(key: string): Promise<string>;
    get(key: string): Promise<unknown | undefined>;
    all(): Promise<{ key: string; value: string; hash: string }[]>;
    close(): Promise<void>;
    drop(): Promise<void>;
    events: EventEmitter;
    access: AccessControllerType;
    log: Log;
  };

  export function KeyValue(args: DatabaseArgs): Promise<KeyValueType>;

  export type DocumentsType = {
    type: "documents",
    name: string;
    identity: Identity;
    meta: object;
    sync: any;
    peers: any;
    address: string;
    put(doc: unknown): Promise<string>;
    del(key: string): Promise<string>;
    get(key: string): Promise<{ key:string; value: unkonwn; hash: string }>
    all(): Promise<{ key: string; value: any; hash: string }[]>;
    query(findFn: (args: unknown) => boolean): Promise<string[]>;
    close(): Promise<void>;
    drop(): Promise<void>;
    events: EventEmitter;
    access: AccessControllerType;
    log: Log;
  }

  export function Documents(args: DatabaseArgs): Promise<DocumentsType>;

  export function KeyStore (args: {storage?: Storage, path?: string}): Promise<KeyStoreType>;

  export type KeyStoreType = {
    clear,
    close,
    hasKey,
    addKey,
    createKey,
    getKey,
    getPublic
  }
}
