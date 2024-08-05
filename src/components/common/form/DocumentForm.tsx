import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import StyledInput from "../StyledInput";
import { DocumentsType } from "@orbitdb/core";

const DocumentForm = ({ Database }: { Database: DocumentsType }) => {
  const [data, setData] =
    useState<{ key: string; value: any; hash: string }[]>();
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewkey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];

  const fetchData = async () => {
    setError(null);
    setNewkey("");
    setNewValue("");
    try {
      await Database.put({ _id: "LinSoap", msg: "hello world" });
      setData(await Database.all());
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
    }
  };
  useEffect(() => {
    fetchData();
  }, [Database]);

  const onAddNewRow = async () => {
    console.log("Key:" + newKey);
    console.log("Value:" + newValue);
    await Database.put({ _id: newKey, newValue });
    fetchData();
  };
  const replacer = (key: string, value: any) => {
    if (key === "_id") {
      return undefined; // 排除 _id 属性
    }
    return value;
  };
  return (
    <div>
      {error && <p>{error}</p>}
      {data?.length === 0 ? (
        <p>This Database is Empty </p>
      ) : (
        <p>Count DataItem:{data?.length}</p>
      )}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
              <Th>Hash</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((data) => (
                <Tr key={data.hash}>
                  <Td>{data.value._id}</Td>
                  <Td>{JSON.stringify(data.value, replacer, 2)}</Td>
                  <Td>{data.hash}</Td>
                </Tr>
              ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td>
                <Box>
                  <StyledInput
                    htmlSize={4}
                    onChange={(event) => setNewkey(event.target.value)}
                  />
                </Box>
              </Td>
              <Td>
                <Box>
                  <StyledInput
                    htmlSize={4}
                    onChange={(event) => setNewValue(event.target.value)}
                  />
                </Box>
              </Td>
              <Td>
                <Button bg={bgButton} onClick={() => onAddNewRow()}>
                  Add New Row
                </Button>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DocumentForm;
