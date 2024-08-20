import { useNavigate } from "react-router-dom";

import { useOrbitDB } from "../../context/OrbitDBProvier";
import {
  Heading,
  Box,
  VStack,
  IconButton,
  Flex,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FaAlignJustify, FaBan, FaCheck } from "react-icons/fa";
import { DocumentsType, EventsType, KeyValueType } from "@orbitdb/core";

const DatabaseInfoHeader = ({
  Database,
  writerble,
}: {
  Database: EventsType | DocumentsType | KeyValueType;
  writerble: boolean;
}) => {
  const navigate = useNavigate();
  const { closeDatabase } = useOrbitDB();

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
            <Heading fontSize="lg">Writeable:</Heading>
            {writerble ? <FaCheck /> : <FaBan />}
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default DatabaseInfoHeader;
