import { useEffect, useState } from 'react';
import { createIpfs } from '../services/ipfs.service';

export const useIpfs = () => {
  const [ipfs, setIpfs] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
        try {
          const ipfs = await createIpfs();
          setIpfs(ipfs);
        } catch (error:any) {
          setError(`Error creating OrbitDB: ${error.message}`);
        }
      };
      init();
  }, []);


  return  { ipfs, error } ;
};
