export type Access = {
    address: string;
    canAppend: (entry: any) => Promise<void>;
    type: string;
    write: string[];
  }