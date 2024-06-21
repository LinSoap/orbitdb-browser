import { useEffect, useState } from 'react';
import { createOrbitdb } from '../services/orbitdb.service';
import { useIpfs } from './useIpfs';



export const useOrbitDB = () => {
  const [orbitDB, setOrbitDB] = useState<any>(null);
  const [error, setError] = useState('');
  const ipfs = useIpfs();
    useEffect(() => {
        const init = async () => {
            try {
                const orbitdbInstance = await createOrbitdb(ipfs, "LinSoap");
                setOrbitDB(orbitdbInstance);
            } catch (error:any) {
                setError(`Error creating OrbitDB: ${error.message}`);
            }
          };
        init();
    }, [ipfs]);
  
  return { orbitDB, error };
};
