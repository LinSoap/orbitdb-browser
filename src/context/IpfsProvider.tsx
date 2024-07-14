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
import { createHelia } from "helia";
import { LevelBlockstore } from "blockstore-level";
import { bootstrap } from "@libp2p/bootstrap";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { useCookies } from "react-cookie";

const IpfsContext = createContext<any | undefined>(undefined);

export const IpfsProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookies, setCookie] = useCookies(["stuns", "topics", "bootstrap"]);
  const [ipfs, setIpfs] = useState<any>(null);
  const [stuns, setStuns] = useState(
    cookies.stuns || [
      "stun:stun.l.google.com:19302",
      "stun:global.stun.twilio.com:3478",
    ]
  );
  const [bootstrapsList, setBootstrapsList] = useState(
    cookies.bootstrap || [""]
  );
  const [topics, setTopics] = useState<string[]>(cookies.topics || []);
  const [error, setError] = useState<string>("");

  const createOptions = () => {
    return {
      addresses: {
        listen: ["/webrtc"],
      },
      transports: [
        webSockets({
          filter: all,
        }),
        webRTC({
          rtcConfiguration: {
            iceServers: [
              {
                urls: stuns,
              },
            ],
          },
        }),
        circuitRelayTransport({
          discoverRelays: 1,
        }),
      ],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      connectionGater: {
        denyDialMultiaddr: () => false,
      },
      peerDiscovery: [
        bootstrap({
          list: bootstrapsList,
        }),
        pubsubPeerDiscovery({
          interval: 10_000,
          topics: topics,
        }),
      ],
      services: {
        identify: identify(),
        pubsub: gossipsub({ allowPublishToZeroTopicPeers: true }),
      },
    };
  };

  const [libp2pOptions, setLibp2pOptions] = useState(createOptions);

  const updateLibp2pOptions = () => {
    setLibp2pOptions(createOptions());
    setCookie("stuns", stuns);
    setCookie("topics", topics);
    setCookie("bootstrap", bootstrapsList);
  };

  const initIpfs = async () => {
    try {
      const libp2p = await createLibp2p({ ...libp2pOptions });
      const blockstore = new LevelBlockstore("./ipfs/blocks");
      // const blockstore = new MemoryBlockstore();
      const ipfs = await createHelia({ libp2p, blockstore });
      setIpfs(ipfs);
    } catch (error: any) {
      setError(`Error creating IPFS: ${error.message}`);
    }
  };

  useEffect(() => {
    initIpfs();
  }, [libp2pOptions]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!ipfs) {
    return <div>Loading IPFS...</div>;
  }

  return (
    <IpfsContext.Provider
      value={{
        ipfs,
        topics,
        setTopics,
        stuns,
        setStuns,
        bootstrapsList,
        setBootstrapsList,
        updateLibp2pOptions,
      }}
    >
      {children}
    </IpfsContext.Provider>
  );
};

export const useIpfs = () => {
  const context = useContext(IpfsContext);
  if (context === undefined) {
    throw new Error("useIpfs must be used within an IpfsProvider");
  }
  return context;
};
