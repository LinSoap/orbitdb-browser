import { useState, useEffect } from "react";
import { useIpfs } from "../../context/IpfsProvider";
import { getPeerTypes } from "../../utils/libp2p";
import { Button, HStack, IconButton, Input } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const Libp2pStatus = () => {
  const {
    ipfs,
    topics,
    setTopics,
    stuns,
    setStuns,
    bootstrapsList,
    setBootstrapsList,
    updateLibp2pOptions,
  } = useIpfs();
  //   console.log(Libp2pBrowserOptions);
  const libp2p = ipfs.libp2p;
  const [peerId, setPeerId] = useState(libp2p.peerId.string);
  const [status, setStatus] = useState(libp2p.status);
  const [connections, setConnections] = useState(libp2p.getConnections());
  const [multiaddrs, setMultiaddrs] = useState(libp2p.getMultiaddrs());
  const [peerTypes, setPeerTypes] = useState(getPeerTypes(libp2p));

  useEffect(() => {
    const interval = setInterval(() => {
      setPeerId(libp2p.peerId.string);
      setStatus(libp2p.status);
      setConnections(libp2p.getConnections());
      setMultiaddrs(libp2p.getMultiaddrs());
      setPeerTypes(getPeerTypes(libp2p));
    }, 5000); // 每5秒刷新一次数据

    return () => clearInterval(interval); // 清除定时器
  }, [libp2p]);

  const handleTopicChange = (index: number, newValue: string) => {
    setTopics((prevTopics: string[]) => {
      const updatedTopics = [...prevTopics];
      updatedTopics[index] = newValue;
      return updatedTopics;
    });
  };
  const handleStunChange = (index: number, newValue: string) => {
    setStuns((prevStuns: string[]) => {
      const updatedStuns = [...prevStuns];
      updatedStuns[index] = newValue;
      return updatedStuns;
    });
  };
  const handleBootstrapsChange = (index: number, newValue: string) => {
    setBootstrapsList((prevBootstraps: string[]) => {
      const updatedBootstraps = [...prevBootstraps];
      updatedBootstraps[index] = newValue;
      return updatedBootstraps;
    });
  };

  const statusList = Object.entries(peerTypes).map(([key, value]) => (
    <li key={key}>
      {key}: {value}
    </li>
  ));
  const multiaddrList = Object.entries(multiaddrs).map((ma) => (
    <li key={ma.toString()}>{ma.toString()}</li>
  ));
  return (
    <>
      <section>
        <h1>PubSub Topics:</h1>
        {topics.map((topic: string, index: number) => (
          <HStack key={index}>
            <Input
              type="text"
              placeholder="PubSub Topic"
              value={topic}
              onChange={(e) => handleTopicChange(index, e.target.value)}
            />
            <IconButton
              aria-label="drop"
              icon={<CloseIcon />}
              onClick={() =>
                setTopics((prevTopics: string[]) =>
                  prevTopics.filter((_, i) => i !== index)
                )
              }
            />
          </HStack>
        ))}
        <Button
          onClick={() => setTopics((prevTopic: string[]) => [...prevTopic, ""])}
        >
          Add Topics
        </Button>
        {stuns.map((stun: string, index: number) => (
          <HStack key={index}>
            <Input
              type="text"
              placeholder="Stun Server"
              value={stun}
              onChange={(e) => handleStunChange(index, e.target.value)}
            />
            <IconButton
              aria-label="drop"
              icon={<CloseIcon />}
              onClick={() =>
                setStuns((prevStuns: string[]) =>
                  prevStuns.filter((_, i) => i !== index)
                )
              }
            />
          </HStack>
        ))}
        <Button
          onClick={() => setStuns((prevStuns: string[]) => [...prevStuns, ""])}
        >
          Add Stuns
        </Button>
        {bootstrapsList.map((bootstraps: string, index: number) => (
          <HStack key={index}>
            <Input
              type="text"
              placeholder="Relay Server multiaddr"
              value={bootstraps}
              onChange={(e) => handleBootstrapsChange(index, e.target.value)}
            />
            <IconButton
              aria-label="drop"
              icon={<CloseIcon />}
              onClick={() =>
                setBootstrapsList((prevBootstraps: string[]) =>
                  prevBootstraps.filter((_, i) => i !== index)
                )
              }
            />
          </HStack>
        ))}
        <Button
          onClick={() =>
            setBootstrapsList((prevBootstraps: string[]) => [
              ...prevBootstraps,
              "",
            ])
          }
        >
          Add Relay Server
        </Button>
        <Button onClick={() => updateLibp2pOptions()}>
          Save Libp2p Options
        </Button>
        <h2>Node</h2>
        <ul>
          <li>Peer ID: {peerId}</li>
          <li>Status: {status}</li>
          <li>
            Connections: {connections.length}
            <ul>{statusList}</ul>
          </li>
          <li>
            Addresses: {multiaddrs.length}
            <ul>{multiaddrList}</ul>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Libp2pStatus;
