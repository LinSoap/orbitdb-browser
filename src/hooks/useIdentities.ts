
import { MemoryStorage } from '@orbitdb/core';
import { useEffect, useState } from 'react';
import { createIdentities } from '../services/identities.service';

export const useIdentities = () => {
    const [identities, setIdentities] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async (path?:string) => {
            try {
                const params = {
                    path: path || './orbitdb/identities',
                    storage: await MemoryStorage(),
                };
                const identities = await createIdentities(params);
                setIdentities(identities);
            } catch (error:any) {
            setError(`Error creating OrbitDB: ${error.message}`);
            }
        };
        init();
    }, []);
    


  return { identities, error };
};
