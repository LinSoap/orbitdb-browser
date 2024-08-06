export interface DatabaseConfig {
    address: string; 
    params: {
      type: "events" | "documents" | "keyvalue";
      meta?: any; 
      sync?: boolean; 
      AccessController?: "ipfs" | "orbitdb"; 
      referencesCount?: number; 
    };
  }