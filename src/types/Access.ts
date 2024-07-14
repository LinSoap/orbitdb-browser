export type BaseAccessControllerType = {
    address: string;
    canAppend: (entry: any) => Promise<void>;
    type: string;
    write: string[];
  };
  
  export type IPFSAccessControllerType = BaseAccessControllerType;
  
  export type OrbitDBAccessControllerType = BaseAccessControllerType & {
    capabilities: () => Promise<void>;
    close: () => Promise<void>;
    drop: () => Promise<void>;
    events: {
      _events: { [key: string]: any };
      _eventsCount: number;
      _maxListeners: number | undefined;
    };
    get: (capability: any) => Promise<Set<string>>;
    grant: (capability: any, key: any) => Promise<void>;
    revoke: (capability: any, key: any) => Promise<void>;
  };
  