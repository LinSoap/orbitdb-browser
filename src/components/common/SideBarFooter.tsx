import { Box, List, ListIcon, ListItem, Tooltip } from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useIpfs } from "../../context/IpfsProvider";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { Link } from "react-router-dom";

const SideBarFooter = () => {
  const { ipfs } = useIpfs();
  const { identity } = useIdentities();
  const { orbitDB } = useOrbitDB();
  return (
    <Box p={4}>
      <List spacing={3}>
        <ListItem>
          <Link to="/libp2p-status">
            {ipfs ? (
              <Box>
                <ListIcon as={FaCheckCircle} />
                <Tooltip label={"Peer ID:" + ipfs.libp2p.peerId.string}>
                  IPFS Available
                </Tooltip>
              </Box>
            ) : (
              <Box>
                <ListIcon as={FaBan} />
                IPFS Unavailable
              </Box>
            )}
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/identity">
            {identity?.id ? (
              <Box>
                <ListIcon as={FaCheckCircle} />
                <Tooltip label={"Identity ID:" + identity.id}>
                  Identity Available
                </Tooltip>
              </Box>
            ) : (
              <Box>
                <ListIcon as={FaBan} />
                Identity Unavailable
              </Box>
            )}
          </Link>
        </ListItem>
        <ListItem>
          {orbitDB ? (
            <Box>
              <ListIcon as={FaCheckCircle} />
              <Tooltip label={"OrbitDB ID:" + orbitDB.id}>
                OrbitDB Available
              </Tooltip>
            </Box>
          ) : (
            <Box>
              <ListIcon as={FaBan} />
              OrbitDB Unavailable
            </Box>
          )}
        </ListItem>
      </List>
    </Box>
  );
};

export default SideBarFooter;
