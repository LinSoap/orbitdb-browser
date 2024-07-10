import { useState, useEffect } from "react";
import { useIpfs } from "../../context/IpfsProvider";
import { getPeerTypes } from "../../utils/libp2p";

const Libp2pStatus = () => {
  const { ipfs } = useIpfs();
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
