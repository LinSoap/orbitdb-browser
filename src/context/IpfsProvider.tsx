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
import { kadDHT } from "@libp2p/kad-dht";
import { mplex } from "@libp2p/mplex";
import { autoNAT } from "@libp2p/autonat";
import { ipnsSelector } from "ipns/selector";
import { ipnsValidator } from "ipns/validator";
import { bootstrap } from "@libp2p/bootstrap";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { useCookies } from "react-cookie";
import { webTransport } from "@libp2p/webtransport";
import { webRTCDirect } from "@libp2p/webrtc";
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
    cookies.bootstrap || [
      // "",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
      "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
      // "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
      // "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
      // "/dnsaddr/bootstrap.libp2p.io/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
      // "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
    ]
  );
  const [topics, setTopics] = useState<string[]>(cookies.topics || [""]);
  const [error, setError] = useState<string>("");

  const createOptions = () => {
    return {
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/0", "/ip6/::/tcp/0", "/webrtc"],
      },
      transports: [
        webSockets({
          filter: all,
        }),
        webTransport(),
        webRTCDirect(),
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
          discoverRelays: 2,
        }),
      ],
      connectionEncryption: [noise()],
      streamMuxers: [yamux(), mplex()],
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
        dht: kadDHT({
          validators: {
            ipns: ipnsValidator,
          },
          selectors: {
            ipns: ipnsSelector,
          },
        }),
        autoNAT: autoNAT(),
      },
      // connectionManager: {
      //   maxConnections: Infinity,
      //   minConnections: 0,
      // },
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
      const ipfs = await createHelia({ libp2p, blockstore });
      // const ipfs = await createHelia({ libp2p, blockstore });
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
