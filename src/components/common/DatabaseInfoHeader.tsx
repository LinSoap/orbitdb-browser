import { useNavigate } from "react-router-dom";
import {
  DocumentsDatabaseType,
  EventsDatabaseType,
  KeyValueDatabaseType,
} from "../../types/Database";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import {
  Heading,
  Box,
  VStack,
  IconButton,
  Flex,
  Tooltip,
  HStack,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FaAlignJustify, FaBan, FaCheck } from "react-icons/fa";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useEffect, useState } from "react";

const DatabaseInfoHeader = ({
  Database,
}: {
  Database:
    | EventsDatabaseType
    | DocumentsDatabaseType
    | KeyValueDatabaseType
    | null;
}) => {
  const navigate = useNavigate();
  const { closeDatabase } = useOrbitDB();
  const { identity } = useIdentities();
  const [writerble, setWriteable] = useState<boolean>(false);

  const hasWriteable = async () => {
    if (Database?.access.type === "orbitdb") {
      const writerSet = await Database?.access?.get("write");
      return writerSet.has(identity.id);
    } else {
      const writerSet = new Set(Database?.access?.write);
      return writerSet.has(identity.id);
    }
  };

  useEffect(() => {
    hasWriteable().then((result) => {
      setWriteable(result);
    });
    console.log(writerble);
  }, [Database, identity]);

  const handleClose = () => {
    closeDatabase(Database);
    navigate("/");
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      boxShadow="md"
      position="relative"
    >
      <Flex position="absolute" top={2} right={2}>
        <Tooltip label="Detail">
          <IconButton
            icon={<FaAlignJustify />}
            size="sm"
            mr={2}
            onClick={() => navigate("./detail")}
            aria-label="Detail"
          />
        </Tooltip>
        <Tooltip label="Close">
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            onClick={handleClose}
            aria-label="Close Database"
          />
        </Tooltip>
      </Flex>
      <VStack spacing={4} align="stretch">
        <Heading fontSize="2xl">OrbitDB Database: {Database?.name}</Heading>
        <Heading fontSize="lg">Address: {Database?.address}</Heading>
        <Flex justifyContent={"space-between"}>
          <Heading fontSize="lg">Type: {Database?.type}</Heading>

          <Heading fontSize="lg">
            AccessController: {Database?.access.type}
          </Heading>
          <HStack>
            <Text>Writeable:</Text>
            {writerble ? <FaCheck /> : <FaBan />}
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default DatabaseInfoHeader;
