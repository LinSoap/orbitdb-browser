import { Box, List, ListIcon, ListItem, Text, Tooltip } from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useIpfs } from "../../context/IpfsProvider";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const DatabaseListFooter = () => {
  const { ipfs } = useIpfs();
  const { identity } = useIdentities();
  const { orbitDB } = useOrbitDB();
  return (
    <Box p={4}>
      {identity?.id ? (
        <Text>Current Identity: {identity.id}</Text>
      ) : (
        <Text>Identity unavailable</Text>
      )}
      <List spacing={3}>
        {ipfs ? (
          <ListItem>
            <ListIcon as={FaCheckCircle} />
            <Tooltip label={"Peer ID:" + ipfs.libp2p.peerId.string}>
              IPFS Available
            </Tooltip>
          </ListItem>
        ) : (
          <ListItem>
            <ListIcon as={FaBan} />
            IPFS Unavailable
          </ListItem>
        )}
        {identity?.id ? (
          <ListItem>
            <ListIcon as={FaCheckCircle} />
            <Tooltip label={"Identity ID:" + identity.id}>
              Identity Available
            </Tooltip>
          </ListItem>
        ) : (
          <ListItem>
            <ListIcon as={FaBan} />
            Identity Unavailable
          </ListItem>
        )}
        {orbitDB ? (
          <ListItem>
            <ListIcon as={FaCheckCircle} />
            <Tooltip label={"OrbitDB ID:" + orbitDB.id}>
              OrbitDB Available
            </Tooltip>
          </ListItem>
        ) : (
          <ListItem>
            <ListIcon as={FaBan} />
            OrbitDB Unavailable
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default DatabaseListFooter;
