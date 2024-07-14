import { IPFSAccessControllerType, OrbitDBAccessControllerType } from "./Access";


export type EventsDatabaseType = {
    access: OrbitDBAccessControllerType|IPFSAccessControllerType;
    add: (value: any) => Promise<void>;
    addOperation: (op: any) => Promise<void>;
    address: string;
    all: () => Promise<any>;
    close: () => Promise<void>;
    drop: () => Promise<void>;
    events: any;
    get: (hash: string) => Promise<any>;
    identity: any;
    iterator: any;
    log: any;
    meta: Record<string, string>;
    name: string;
    peers: Set<string>;
    sync: any;
    type: string;
}

export type DocumentsDatabaseType = {
    access: OrbitDBAccessControllerType|IPFSAccessControllerType;
    addOperation: (op: any) => Promise<void>;
    address: string;
    all: () => Promise<any>;
    close: () => Promise<void>;
    del: (key: string) => Promise<void>;
    drop: () => Promise<void>;
    events: any;
    get: (key: string) => Promise<any>;
    identity: any;
    indexBy: string;
    iterator: any;
    log: any;
    meta: Record<string, string>;
    name: string;
    peers: Set<string>;
    put: (doc: any) => Promise<void>;
    query: (findFn: (doc: any) => boolean) => Promise<any>;
    sync: any;
    type: string;
  };

  export type KeyValueDatabaseType = {
    access: OrbitDBAccessControllerType|IPFSAccessControllerType;
    addOperation: (op: any) => Promise<void>;
    address: string;
    all: () => Promise<any>;
    close: () => Promise<void>;
    del: (key: string) => Promise<void>;
    drop: () => Promise<void>;
    events: any;
    get: (key: string) => Promise<any>;
    identity: any;
    iterator: any;
    log: any;
    meta: Record<string, string>;
    name: string;
    peers: Set<string>;
    put: (key: string, value: any) => Promise<void>;
    set: (key: string, value: any) => Promise<void>;
    sync: any;
    type: string;
  };
  