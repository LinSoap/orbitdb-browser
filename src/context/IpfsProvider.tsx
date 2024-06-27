import React, { createContext, useContext, useState, useEffect } from "react";
import { webSockets } from "@libp2p/websockets";
import { webRTC } from "@libp2p/webrtc";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { all } from "@libp2p/websockets/filters";
import { identify } from "@libp2p/identify";
import { createLibp2p } from "libp2p";
import { MemoryBlockstore } from "blockstore-core";
import { createHelia } from "helia";
import { bitswap } from "@helia/block-brokers";

const Libp2pBrowserOptions = {
  addresses: {
    listen: ["/webrtc"],
  },
  transports: [
    webSockets({
      filter: all,
    }),
    webRTC(),
    circuitRelayTransport({
      discoverRelays: 1,
    }),
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  connectionGater: {
    denyDialMultiaddr: () => false,
  },
  services: {
    identify: identify(),
    pubsub: gossipsub({ allowPublishToZeroTopicPeers: true }),
  },
};

const IpfsContext = createContext<{ ipfs: any } | undefined>(undefined);

export const IpfsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ipfs, setIpfs] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initIpfs = async () => {
      try {
        const libp2pOptions = Libp2pBrowserOptions;
        const libp2p = await createLibp2p({ ...libp2pOptions });
        const blockstore = new MemoryBlockstore();

        const heliaOptions = {
          blockstore,
          libp2p,
          blockBrokers: [bitswap()],
        };
        const ipfs = await createHelia({ ...heliaOptions });
        setIpfs(ipfs);
      } catch (error: any) {
        setError(`Error creating IPFS: ${error.message}`);
      }
    };

    initIpfs();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!ipfs) {
    return <div>Loading IPFS...</div>;
  }

  return (
    <IpfsContext.Provider value={{ ipfs }}>{children}</IpfsContext.Provider>
  );
};

export const useIpfs = () => {
  const context = useContext(IpfsContext);
  if (context === undefined) {
    throw new Error("useIpfs must be used within an IpfsProvider");
  }
  return context;
};
