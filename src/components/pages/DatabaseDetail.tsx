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
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Text,
  VStack,
  useColorMode,
  useTheme,
  Card,
} from "@chakra-ui/react";
import MainTitle from "../common/MainTitle";

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
      {error && <Text>{error}</Text>}
      <MainTitle title="Database Detail" />
      <VStack spacing={4} align="stretch">
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Address</Td>
                <Td>{Database?.address}</Td>
              </Tr>
              <Tr>
                <Td>Name</Td>
                <Td>{Database?.name}</Td>
              </Tr>
              <Tr>
                <Td>Meta</Td>
                <Td>{JSON.stringify(Database?.meta)}</Td>
              </Tr>
              <Tr>
                <Td>Access Address</Td>
                <Td>{Database?.access.address}</Td>
              </Tr>
              <Tr>
                <Td>Access Type</Td>
                <Td>{Database?.access.type}</Td>
              </Tr>
              <Tr>
                <Td>Peers</Td>
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
                  <Td>Writable ID</Td>
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
