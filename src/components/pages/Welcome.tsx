import {
  Box,
  VStack,
  Button,
  Text,
  Heading,
  AbsoluteCenter,
  Link,
} from "@chakra-ui/react";
import { FaBook, FaPlay, FaCog, FaAt, FaPlus } from "react-icons/fa";
import { RiP2pFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6} minH={"100vh"} position="relative">
      <AbsoluteCenter p="4" axis="both">
        <Heading as="h1" size="xl" mb={4}>
          Welcome to OrbitDB-Browser
        </Heading>
        <Text fontSize="lg" mb={6}>
          Easily manage your OrbitDB.
        </Text>
        <VStack spacing={4} align="center">
          <Button leftIcon={<FaBook />} variant="outline" size="lg" w={"60%"}>
            <Link
              href="https://github.com/LinSoap/orbitdb-browser/wiki"
              isExternal
            >
              Read Documentation
            </Link>
          </Button>

          <Button
            leftIcon={<FaAt />}
            variant="outline"
            size="lg"
            w={"60%"}
            onClick={() => navigate("/identity")}
          >
            Identity Management
          </Button>

          <Button
            leftIcon={<FaPlay />}
            variant="outline"
            size="lg"
            w={"60%"}
            onClick={() => navigate("/connect-database")}
          >
            Connect Database
          </Button>

          <Button
            leftIcon={<FaPlus />}
            variant="outline"
            size="lg"
            w={"60%"}
            onClick={() => navigate("/add-database")}
          >
            Create New Database
          </Button>
          <Button
            leftIcon={<FaCog />}
            variant="outline"
            size="lg"
            w={"60%"}
            onClick={() => navigate("/libp2p-config")}
          >
            Libp2p Config
          </Button>
          <Button
            leftIcon={<RiP2pFill />}
            variant="outline"
            size="lg"
            w={"60%"}
            onClick={() => navigate("/libp2p-status")}
          >
            Libp2p Connect Status
          </Button>
        </VStack>
      </AbsoluteCenter>
    </Box>
  );
};

export default Welcome;
