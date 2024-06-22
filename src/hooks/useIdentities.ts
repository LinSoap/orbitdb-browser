
import { Identities, MemoryStorage } from '@orbitdb/core';
import { useEffect, useState } from 'react';

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
                const identities = await await Identities(params);
                setIdentities(identities);
            } catch (error:any) {
            setError(`Error creating OrbitDB: ${error.message}`);
            }
        };
        init();
    }, []);
    


  return { identities, error };
};
