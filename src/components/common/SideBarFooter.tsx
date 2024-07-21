import { Box, List, ListIcon, ListItem, Tooltip } from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useIpfs } from "../../context/IpfsProvider";
import { FaBan, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { Link } from "react-router-dom";

const SideBarFooter = () => {
  const { ipfs, topics, stuns, bootstrapsList } = useIpfs();
  const { identity } = useIdentities();
  const { orbitDB } = useOrbitDB();

  const IPFSStatus = () => {
    let statusIcon = FaQuestionCircle;
    let statusText = "IPFS Partially Available";

    if (!ipfs) {
      statusIcon = FaBan;
      statusText = "IPFS Unavailable";
    } else if (
      topics.length !== 0 &&
      topics[0] !== "" &&
      stuns.length !== 0 &&
      bootstrapsList[0] !== ""
    ) {
      statusIcon = FaCheckCircle;
      statusText = "IPFS Available";
    }

    return (
      <ListItem>
        <Link to="/libp2p-status">
          <Box>
            <ListIcon as={statusIcon} />
            <Tooltip
              label={ipfs ? `Peer ID: ${ipfs.libp2p.peerId.string}` : undefined}
            >
              {statusText}
            </Tooltip>
          </Box>
        </Link>
      </ListItem>
    );
  };

  return (
    <Box p={4}>
      <List spacing={3}>
        {IPFSStatus()}
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
