import {
  Box,
  Button,
  Card,
  Input,
  Table,
  Tbody,
  Td,
  Tr,
  useColorMode,
  useTheme,
  VStack,
  Text,
  InputGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { RecentDatabaseType } from "../../types/Orbitdb";

const ConnectDatabse = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<string>("");
  const { orbitDB, addDatabase, databases, recentDatabase } = useOrbitDB();

  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  const bgButton = theme.colors.custom.bgButton[colorMode];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const handleClick = async (address: string) => {
    try {
      if (orbitDB) {
        const db = await orbitDB.open(address);
        if (db) {
          if (
            !databases.some((database: any) => database.address === db.address)
          ) {
            addDatabase(db);
          }
          navigate("/database-info" + db.address);
        }
      }
    } catch (error) {
      console.error("Error opening database:", error);
    }
  };

  return (
    <Card bg={bgColorMain} h={"full"}>
      <Box p={4} borderBottom="1px solid #e2e8f0">
        <Text fontSize="xl" fontWeight="bold">
          Connect Database
        </Text>
      </Box>
      <Box p={4}>
        <VStack align="stretch" spacing={4}>
          <Box display="flex" alignItems="center">
            <InputGroup flex="1" mr={4}>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Connect by Database Address Or Name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick(address);
                  }
                }}
              />
            </InputGroup>
            <Button onClick={() => handleClick(address)} bg={bgButton}>
              Connect
            </Button>
          </Box>
        </VStack>
      </Box>
      <VStack p={4} align="stretch">
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>Name</Td>
              <Td>Database ID</Td>
              <Td>Latest Opened</Td>
              <Td>Action</Td>
            </Tr>
            {recentDatabase.map((db: RecentDatabaseType) => (
              <Tr key={db.DatabaseAddress}>
                <Td>{db.name}</Td>
                <Td>{db.DatabaseAddress}</Td>
                <Td>{formatDate(db.latestOpened)}</Td>
                <Td>
                  <Button
                    onClick={() => handleClick(db.DatabaseAddress)}
                    colorScheme="blue"
                  >
                    Open
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Card>
  );
};

export default ConnectDatabse;
