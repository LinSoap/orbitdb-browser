import { useState, useEffect } from "react";
import { useIpfs } from "../../context/IpfsProvider";
import { multiaddr } from "@multiformats/multiaddr";
import { extractProtocols, getPeerTypes } from "../../utils/libp2p";
import {
  Box,
  Card,
  Flex,
  useColorMode,
  useTheme,
  IconButton,
  Code,
  Table,
  Tbody,
  Tr,
  Td,
  Collapse,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { CopyIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Circuit } from "@multiformats/multiaddr-matcher";
import { protocols } from "@multiformats/multiaddr";
import Loading from "../common/Loading";
import MainTitle from "../common/MainTitle";
import StyledInput from "../common/StyledInput";
import { FaLink, FaSyncAlt } from "react-icons/fa";
import CopyIconButton from "../common/CopyIconButton";
const Libp2pStatus = () => {
  const { ipfs, bootstrapsList } = useIpfs();
  const libp2p = ipfs.libp2p;
  const [peerId, setPeerId] = useState(libp2p.peerId.string);
  const [status, setStatus] = useState(libp2p.status);
  const [connections, setConnections] = useState(libp2p.getConnections());
  const [multiaddrs, setMultiaddrs] = useState(libp2p.getMultiaddrs());
  const [peerTypes, setPeerTypes] = useState(getPeerTypes(libp2p));
  const [connectPeer, setConnectPeer] = useState("");
  const [isMultiaddrsOpen, setIsMultiaddrsOpen] = useState(false);
  const [isConnectPeersOpen, setIsConnectPeersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePeerConnect = () => {
    setConnections(libp2p.getConnections());
    setMultiaddrs(libp2p.getMultiaddrs());
    setPeerTypes(getPeerTypes(libp2p));
    multiaddrs.map((multiaddr: string) => {
      extractProtocols(multiaddr.toString());
    });
  };

  useEffect(() => {
    setPeerId(libp2p.peerId.string);
    setStatus(libp2p.status);

    libp2p.addEventListener("peer:connect", handlePeerConnect);

    setLoading(false);

    return () => {
      libp2p.removeEventListener("peer:connect", handlePeerConnect);
    };
  }, [libp2p]);

  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  const peers = libp2p.getPeers().map((peer: any) => peer.toString());
  const bootstrapsPeerIdList = bootstrapsList.map((bootstrap: string) =>
    bootstrap.split("/").at(-1)
  );

  const relayMultiaddrs = libp2p
    .getMultiaddrs()
    .filter((multiaddr: any) => Circuit.exactMatch(multiaddr));

  const relayPeers = relayMultiaddrs.map(
    (multiaddr: any) =>
      multiaddr
        .stringTuples()
        .filter(([name, _]: [any, any]) => name === protocols("p2p").code)
        .map(([_, value]: [any, any]) => value)[0]
  );

  const getPeerType = (peer: string) => {
    if (bootstrapsPeerIdList.includes(peer)) {
      return "Bootstrap";
    }
    if (relayPeers.includes(peer)) {
      return "Relay";
    }
    return "Normal";
  };

  const handleConnect = async (peerMultiaddr: string) => {
    let maddr = multiaddr(peerMultiaddr);
    try {
      await libp2p.dial(maddr);
    } catch (e) {
      console.log(e);
    }
  };

  const statusList = Object.entries(peerTypes).map(([key, value]) => (
    <Tr key={key}>
      <Td>{key}</Td>
      <Td />
      <Td>{value}</Td>
    </Tr>
  ));

  const multiaddrList = multiaddrs.map((multiaddr: string) => (
    <Tr key={multiaddr.toString()}>
      <Td>
        <Flex wrap="wrap" gap={2}>
          {extractProtocols(multiaddr.toString()).map(
            (type: string, index: number) => (
              <Tag key={index} borderRadius="full" variant="solid">
                <TagLabel>{type}</TagLabel>
              </Tag>
            )
          )}
        </Flex>
      </Td>

      <Td>
        <Flex alignItems="center">
          <Code>{multiaddr.toString()}</Code>
        </Flex>
      </Td>
      <Td>
        <IconButton
          aria-label="Copy multiaddr"
          icon={<CopyIcon />}
          size="sm"
          ml={2}
          onClick={() => navigator.clipboard.writeText(multiaddr.toString())}
        />
      </Td>
    </Tr>
  ));

  const connectPeersList = peers.map((peer: string) => (
    <Tr key={peer}>
      <Td>{getPeerType(peer)}</Td>
      <Td>
        <Flex alignItems="center">
          <Code>{peer}</Code>
        </Flex>
      </Td>
      <Td>
        <CopyIconButton ariaLabel={"Copy multiaddr"} data={peer.toString()} />
      </Td>
    </Tr>
  ));

  return (
    <Card bg={bgColorMain} minH={"101%"}>
      <MainTitle title="Libp2p Status" />
      {loading ? (
        <Loading />
      ) : (
        <Box p={4}>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Peer ID:</Td>
                <Td>
                  {peerId}
                  <CopyIconButton ariaLabel={"Copy peer id"} data={peerId} />
                </Td>
                <Td />
              </Tr>
              <Tr>
                <Td fontWeight="bold">Status:</Td>
                <Td textTransform={"uppercase"}>{status}</Td>
                <Td />
              </Tr>
              <Tr>
                <Td fontWeight="bold">Connections:</Td>
                <Td>{connections.length}</Td>
                <Td>
                  <IconButton
                    aria-label="Refresh connections"
                    icon={<FaSyncAlt />}
                    onClick={() => handlePeerConnect()}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td colSpan={2}>
                  <Table variant="simple">
                    <Tbody>
                      <Tr>
                        <Td>Peer Type</Td>
                        <Td />
                        <Td>Count</Td>
                      </Tr>
                      {statusList}
                    </Tbody>
                  </Table>
                </Td>
                <Td />
              </Tr>
              <Tr>
                <Td fontWeight="bold">Connect New Peer</Td>
                <Td>
                  <StyledInput
                    value={connectPeer}
                    onChange={(e) => setConnectPeer(e.target.value)}
                  ></StyledInput>
                </Td>
                <Td>
                  <IconButton
                    aria-label={"connect"}
                    icon={<FaLink />}
                    onClick={() => handleConnect(connectPeer)}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Multiaddr:</Td>
                <Td>{multiaddrs.length}</Td>
                <Td>
                  <IconButton
                    onClick={() => setIsMultiaddrsOpen(!isMultiaddrsOpen)}
                    aria-label="Toggle multiaddrs"
                    icon={
                      isMultiaddrsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                    }
                  />
                </Td>
              </Tr>
              {multiaddrList.length > 0 && (
                <Tr>
                  <Td colSpan={3}>
                    <Collapse in={isMultiaddrsOpen}>
                      <Table variant="simple">
                        <Tbody>{multiaddrList}</Tbody>
                      </Table>
                    </Collapse>
                  </Td>
                </Tr>
              )}
              <Tr>
                <Td fontWeight="bold">Connected Peer:</Td>
                <Td>{peers.length}</Td>
                <Td>
                  <IconButton
                    onClick={() => setIsConnectPeersOpen(!isConnectPeersOpen)}
                    aria-label="Toggle Connected Peer"
                    icon={
                      isConnectPeersOpen ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )
                    }
                  />
                </Td>
              </Tr>
              {peers.length > 0 && (
                <Tr>
                  <Td colSpan={3}>
                    <Collapse in={isConnectPeersOpen}>
                      <Table variant="simple">
                        <Tbody>{connectPeersList}</Tbody>
                      </Table>
                    </Collapse>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}
    </Card>
  );
};

export default Libp2pStatus;
