export type EventsDataType =  {
    hash: string;
    value: string;
}
export type DocumentsDataType =  {
    key: string;
    hash: string;
    value: {
        _id: string;
        [key: string]: any;
    }
}
export type KeyValueDataType =  {
    key: string;
    hash: string;
    value: string;
}
  
export type OrbitDBContextType =  {
    orbitDB: any;
    databases: any[];
    getDatabase: (address: string) => any;
    addDatabase: (database: any) => void;
    closeDatabase: (database: any) => void;
}

export type RecentDatabaseType = {
    name: string;
    DatabaseAddress: string;
    latestOpened: string;
}