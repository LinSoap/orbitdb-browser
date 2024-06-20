import { useState, useEffect } from 'react';
import { useIpfs } from './useIpfs';
import OrbitdbService from '../services/orbitdb.service';


export const useOrbitDb = (id?: string) => {
    const [orbitDb, setOrbitDb] = useState<any>(null);
    const ipfs = useIpfs();

    useEffect(() => {
        if (ipfs) {
            const initializeOrbitDb = async () => {
                const service = OrbitdbService.getInstance();
                await service.loadInstance(ipfs, id);
                setOrbitDb(service);
            };

            initializeOrbitDb();
        }
    }, [ipfs]);

    return orbitDb;
};
