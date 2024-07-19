import {
  Button,
  Input,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Card,
  Flex,
  useTheme,
  useColorMode,
} from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useState } from "react";

const IdentityInfo = () => {
  const { identity, createIdentity, removeIdentity } = useIdentities();
  const [id, setId] = useState<string>("");
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  return (
    <Card bg={bgColorMain}>
      <Box p={4} borderBottom="1px solid #e2e8f0">
        <Text fontSize="xl" fontWeight="bold">
          Identity Info
        </Text>
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Id</Td>
            <Td>{identity?.id}</Td>
          </Tr>
          <Tr>
            <Td>Public Key</Td>
            <Td>{identity?.publicKey}</Td>
          </Tr>
          <Tr>
            <Td>Hash</Td>
            <Td>{identity?.hash}</Td>
          </Tr>
          <Tr>
            <Td>Type</Td>
            <Td>{identity?.type}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Box mt={4} paddingX={20}>
        <Flex align="center">
          <Input
            placeholder="Enter new id"
            value={id}
            onChange={(event) => setId(event.target.value)}
            mr={2}
          />
          <Button
            colorScheme="messenger"
            onClick={() => createIdentity(id)}
            mr={2}
          >
            Create
          </Button>
          <Button colorScheme="messenger" onClick={() => removeIdentity()}>
            Remove
          </Button>
        </Flex>
      </Box>
    </Card>
  );
};

export default IdentityInfo;
