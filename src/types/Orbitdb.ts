export type OrbitDBDataType =  {
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