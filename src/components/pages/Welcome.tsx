import {
  Box,
  VStack,
  Button,
  Text,
  Heading,
  Divider,
  Stack,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { FaBook, FaPlay, FaCog, FaAt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <Box textAlign="center" py={10} px={6} minH={"100vh"} position="relative">
      <AbsoluteCenter p="4" color="white" axis="both">
        <Heading as="h1" size="xl" mb={4}>
          Welcome to OrbitDB-Browser
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          Easily manage your OrbitDB.
        </Text>
        <VStack spacing={4} align="center">
          <Button leftIcon={<FaBook />} variant="outline" size="lg" w={"60%"}>
            <Link to="/">Read Documentation</Link>
          </Button>

          <Button leftIcon={<FaAt />} variant="outline" size="lg" w={"60%"}>
            <Link to="/identity">Identity Management</Link>
          </Button>

          <Button leftIcon={<FaPlay />} variant="outline" size="lg" w={"60%"}>
            <Link to="/connect-database">Connect Database</Link>
          </Button>

          <Button leftIcon={<FaPlus />} variant="outline" size="lg" w={"60%"}>
            <Link to="/add-database">Create New Database</Link>
          </Button>

          <Button leftIcon={<FaCog />} variant="outline" size="lg" w={"60%"}>
            <Link to="/libp2p-status">Libp2p Connect Status</Link>
          </Button>
        </VStack>
        <Divider my={6} />
        <Stack direction={["column", "row"]} spacing={4} justify="center">
          <Link to={"/"}>Visit Website</Link>
          <Link to={"/"}>Join Community</Link>
          <Link to={"/"}>Contact Support</Link>
        </Stack>
      </AbsoluteCenter>
    </Box>
  );
};

export default Welcome;
