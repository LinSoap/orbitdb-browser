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
} from "@chakra-ui/react";
import { CopyIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const Libp2pStatus = () => {
  const { ipfs } = useIpfs();
  const libp2p = ipfs.libp2p;
  const [peerId, setPeerId] = useState(libp2p.peerId.string);
  const [status, setStatus] = useState(libp2p.status);
  const [connections, setConnections] = useState(libp2p.getConnections());
  const [multiaddrs, setMultiaddrs] = useState(libp2p.getMultiaddrs());
  const [peerTypes, setPeerTypes] = useState(getPeerTypes(libp2p));
  const [isMultiaddrsOpen, setIsMultiaddrsOpen] = useState(false);

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

  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];

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
        <Flex alignItems="center">
          <IconButton
            aria-label="Copy multiaddr"
            icon={<CopyIcon />}
            size="sm"
            ml={2}
            onClick={() => navigator.clipboard.writeText(multiaddr.toString())}
          />
          <Code>{multiaddr.toString()}</Code>
        </Flex>
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
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export default Libp2pStatus;
