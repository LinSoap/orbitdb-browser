export type DatabaseType = {
    access: any;
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
    meta: Record<string, any>;
    name: string;
    peers: Set<any>;
    sync: any;
    type: string;
}