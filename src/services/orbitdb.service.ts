import { createOrbitDB } from '@orbitdb/core';

class OrbitdbService {
    private static instance: OrbitdbService;
    private localInstance: any;
    private databases: any[];

    private constructor() {
        this.databases = [];
    }

    public static getInstance(): OrbitdbService {
        if (!OrbitdbService.instance) {
            OrbitdbService.instance = new OrbitdbService();
        }
        return OrbitdbService.instance;
    }

    public async loadInstance(ipfs: any, id?: string) {
        if (!this.localInstance) {
            this.localInstance = await createOrbitDB({ipfs, id });
        }
    }

    public async createDatabase(address: string, type: string, options?: any) {
        if (!this.localInstance) {
            throw new Error('OrbitDB instance not created. Call loadLocalInstance() first.');
        }
        const database = await this.localInstance.open(address, { type, ...options });
        this.databases.push(database);
        return database;
    }
}

export default OrbitdbService;
