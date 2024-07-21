import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { FaCheck } from "react-icons/fa";

const OrbitDBController = ({
  writers,
  setWriters,
  grantID,
  revokeID,
}: {
  writers: Set<string>;
  setWriters: (writers: Set<string>) => void;
  grantID: (ID: string) => Promise<void>;
  revokeID: (ID: string) => Promise<void>;
}) => {
  const handleInputChange = (index: number, value: string) => {
    const writersArray = Array.from(writers);
    writersArray[index] = value;
    setWriters(new Set(writersArray));
  };

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Writable ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from(writers || []).map((id: string, index: number) => (
              <Tr key={index}>
                <Td>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Writable ID"
                      value={id}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    <InputRightElement width="auto" padding="6px">
                      <IconButton
                        aria-label="grant"
                        icon={<FaCheck />}
                        onClick={() => grantID(id)}
                        size="sm"
                        mr={2}
                        p={2}
                      />
                      <IconButton
                        aria-label="revoke"
                        icon={<CloseIcon />}
                        onClick={() => revokeID(id)}
                        size="sm"
                        p={2}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={2}>
                <Button
                  onClick={() =>
                    setWriters(new Set([...Array.from(writers), ""]))
                  }
                  width="100%"
                >
                  Add ID
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrbitDBController;
