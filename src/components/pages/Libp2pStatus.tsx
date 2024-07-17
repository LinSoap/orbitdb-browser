import { useState, useEffect } from "react";
import { useIpfs } from "../../context/IpfsProvider";
import { getPeerTypes } from "../../utils/libp2p";
import {
  Box,
  Text,
  Card,
  Flex,
  useColorMode,
  useTheme,
  IconButton,
  Code,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { CopyIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Circuit } from "@multiformats/multiaddr-matcher";
import { protocols } from "@multiformats/multiaddr";
const Libp2pStatus = () => {
  const { ipfs, bootstrapsList } = useIpfs();
  const libp2p = ipfs.libp2p;
  const [peerId, setPeerId] = useState(libp2p.peerId.string);
  const [status, setStatus] = useState(libp2p.status);
  const [connections, setConnections] = useState(libp2p.getConnections());
  const [multiaddrs, setMultiaddrs] = useState(libp2p.getMultiaddrs());
  const [peerTypes, setPeerTypes] = useState(getPeerTypes(libp2p));
  const [isMultiaddrsOpen, setIsMultiaddrsOpen] = useState(false);
  const [isConnectPeersOpen, setIsConnectPeersOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeerId(libp2p.peerId.string);
      setStatus(libp2p.status);
      setConnections(libp2p.getConnections());
      setMultiaddrs(libp2p.getMultiaddrs());
      setPeerTypes(getPeerTypes(libp2p));
      multiaddrs.map((multiaddr: string) => {
        extractProtocols(multiaddr.toString());
      });
    }, 5000); // 每5秒刷新一次数据

    return () => clearInterval(interval); // 清除定时器
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
    .filter((ma: any) => Circuit.exactMatch(ma));

  const relayPeers = relayMultiaddrs.map(
    (ma: any) =>
      ma
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

  const extractProtocols = (multiaddr: string): string[] => {
    const protocols = new Set();
    const parts = multiaddr.split("/");

    parts.forEach((part) => {
      if (
        part &&
        // match PeerId
        !part.match(/^[A-Za-z0-9]{52}$/) &&
        // match Port
        !part.match(
          /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
        ) &&
        // match ipv4 address
        !part.match(/^\d+\.\d+\.\d+\.\d+$/) &&
        // match ipv6 address
        !part.match(
          /(?:^|:)(?:[0-9a-fA-F]{0,4}){1,8}(?::[0-9a-fA-F]{1,4}){1,7}(?::(?:[0-9a-fA-F]{0,4}){1,8})?/
        )
      ) {
        protocols.add(part);
      }
    });
    return Array.from(protocols) as string[];
  };

  const statusList = Object.entries(peerTypes).map(([key, value]) => (
    <Tr key={key}>
      <Td>{key}</Td>
      <Td>{value}</Td>
      <Td />
    </Tr>
  ));

  const multiaddrList = multiaddrs.map((multiaddr: string) => (
    <Tr key={multiaddr.toString()}>
      <Td>
        <Flex wrap="wrap" gap={2}>
          {extractProtocols(multiaddr.toString()).map((type: string) => (
            <Tag key={type} borderRadius="full" variant="solid">
              <TagLabel>{type}</TagLabel>
            </Tag>
          ))}
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
        <IconButton
          aria-label="Copy multiaddr"
          icon={<CopyIcon />}
          size="sm"
          ml={2}
          onClick={() => navigator.clipboard.writeText(peer.toString())}
        />
      </Td>
    </Tr>
  ));

  return (
    <Card bg={bgColorMain}>
      <Box p={4} borderBottom="1px solid #e2e8f0">
        <Flex>
          <Text fontSize="xl" fontWeight="bold">
            Node Status
          </Text>
        </Flex>
      </Box>
      <Box p={4}>
        <Table variant="simple">
          <Thead></Thead>
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Peer ID:</Td>
              <Td>{peerId}</Td>
              <Td />
            </Tr>
            <Tr>
              <Td fontWeight="bold">Status:</Td>
              <Td>{status}</Td>
              <Td />
            </Tr>
            <Tr>
              <Td fontWeight="bold">Connections:</Td>
              <Td>{connections.length}</Td>
              <Td />
            </Tr>
            {statusList.length > 0 && (
              <Tr>
                <Td colSpan={2}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Peer Type</Th>
                        <Th>Count</Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>{statusList}</Tbody>
                  </Table>
                </Td>
                <Td />
              </Tr>
            )}
            <Tr>
              <Td fontWeight="bold">Multiaddr:</Td>
              <Td>{multiaddrs.length}</Td>
              <Td>
                <IconButton
                  size="sm"
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
                <Td colSpan={2}>
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
                  size="sm"
                  onClick={() => setIsConnectPeersOpen(!isConnectPeersOpen)}
                  aria-label="Toggle Connected Peer"
                  icon={
                    isConnectPeersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                />
              </Td>
            </Tr>
            {peers.length > 0 && (
              <Tr>
                <Td colSpan={2}>
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
    </Card>
  );
};

export default Libp2pStatus;
