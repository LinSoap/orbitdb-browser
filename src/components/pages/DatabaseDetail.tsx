import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import {
  DocumentsDatabaseType,
  EventsDatabaseType,
  KeyValueDatabaseType,
} from "../../types/Database";
import OrbitDBController from "../common/OrbitDBController";
import { OrbitDBAccessControllerType } from "../../types/Access";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  VStack,
  useColorMode,
  useTheme,
  Card,
} from "@chakra-ui/react";

const DatabaseDetail = () => {
  const { address } = useParams<{ address: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [orbitDBWriters, setorbitDBWriters] = useState<Set<string>>(
    new Set<string>()
  );
  const [Database, setDatabase] = useState<
    EventsDatabaseType | DocumentsDatabaseType | KeyValueDatabaseType | null
  >(null);
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  const init = async () => {
    setError(null);
    try {
      if (address) {
        const db = await getDatabase(address);
        setDatabase(db);
        if (Database?.access.type === "orbitdb") {
          const orbitDBWriters = await (
            Database?.access as OrbitDBAccessControllerType
          ).get("write");

          setorbitDBWriters(orbitDBWriters);
        }
      }
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
    }
  };

  const grantID = async (ID: string) => {
    if (Database?.access) {
      await (Database?.access as OrbitDBAccessControllerType).grant(
        "write",
        ID
      );
      await init(); // 确保在授予权限后重新初始化数据
    }
  };

  const revokeID = async (ID: string) => {
    if (Database?.access) {
      await (Database?.access as OrbitDBAccessControllerType).revoke(
        "write",
        ID
      );
      await init();
    }
  };

  useEffect(() => {
    init();
  }, [address, getDatabase, Database]);

  return (
    <Card bg={bgColorMain}>
      <Box p={4} borderBottom="1px solid #e2e8f0">
        <Text fontSize="xl" fontWeight="bold">
          Database Detail
        </Text>
      </Box>
      <VStack spacing={4} align="stretch">
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Th>Address</Th>
                <Td>{Database?.address}</Td>
              </Tr>
              <Tr>
                <Th>Name</Th>
                <Td>{Database?.name}</Td>
              </Tr>
              <Tr>
                <Th>Meta</Th>
                <Td>{JSON.stringify(Database?.meta)}</Td>
              </Tr>
              <Tr>
                <Th>Access Address</Th>
                <Td>{Database?.access.address}</Td>
              </Tr>
              <Tr>
                <Th>Access Type</Th>
                <Td>{Database?.access.type}</Td>
              </Tr>
              <Tr>
                <Th>Peers</Th>
                <Td>
                  {Database?.peers.length > 0 ? (
                    <Text>hello</Text>
                  ) : (
                    <Text>No peers available.</Text>
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        {Database?.access.write.length > 0 ? (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Writable ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Database.access.write.map((id: string) => (
                  <Tr key={id}>
                    <Td>{id}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text>No writable IDs available.</Text>
        )}
        {Database?.access.type === "orbitdb" ? (
          <OrbitDBController
            writers={orbitDBWriters}
            setWriters={setorbitDBWriters}
            grantID={grantID}
            revokeID={revokeID}
          />
        ) : null}
      </VStack>
    </Card>
  );
};

export default DatabaseDetail;
