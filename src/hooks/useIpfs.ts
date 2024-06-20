import { useState, useEffect } from 'react';
import IpfsService from '../services/ipfs.service';

export const useIpfs = () => {
    const [ipfs, setIpfs] = useState<any>(null);

    useEffect(() => {
        const initialize = async () => {
            const service = IpfsService.getInstance();
            await service.createInstance();
            setIpfs(service.getInstance());
        };

        initialize();
    }, []);

    return ipfs;
};
