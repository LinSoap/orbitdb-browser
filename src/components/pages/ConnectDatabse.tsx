import {
  Box,
  Button,
  Card,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
  useColorMode,
  useTheme,
  VStack,
  InputGroup,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { RecentDatabaseType } from "../../types/Orbitdb";
import MainTitle from "../common/MainTitle";
import StyledInput from "../common/StyledInput";
import CopyIconButton from "../common/CopyIconButton";

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
      <MainTitle title="Connect Database" />
      <Box p={4}>
        <VStack align="stretch" spacing={4}>
          <Box display="flex" alignItems="center">
            <InputGroup flex="1" mr={4}>
              <StyledInput
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
              <Td>Address</Td>
              <Td>Type</Td>
              <Td>Access</Td>
              <Td>Latest Opened</Td>
              <Td>Action</Td>
            </Tr>
            {recentDatabase.map((db: RecentDatabaseType) => (
              <Tr key={db.address}>
                <Td>{db.name}</Td>
                <Td>
                  <Flex align="center">
                    <Text>{db.address}</Text>
                    <Spacer />
                    <CopyIconButton
                      ariaLabel={"Copy address"}
                      data={db.address}
                    />
                  </Flex>
                </Td>
                <Td>{db.type}</Td>
                <Td>{db.acccess}</Td>
                <Td>{formatDate(db.latestOpened)}</Td>
                <Td>
                  <Button onClick={() => handleClick(db.address)} bg={bgButton}>
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
