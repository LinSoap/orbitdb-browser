import { useEffect, useState } from "react";
import {} from "../../../context/OrbitDBProvier";
import {
  Button,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DocumentsDataType } from "../../../types/Orbitdb";
import { DocumentsDatabaseType } from "../../../types/Database";

const DocumentForm = ({ Database }: { Database: DocumentsDatabaseType }) => {
  const [data, setData] = useState<DocumentsDataType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewkey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

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
                <Input
                  htmlSize={4}
                  onChange={(event) => setNewkey(event.target.value)}
                />
              </Td>
              <Td>
                <Input
                  htmlSize={4}
                  onChange={(event) => setNewValue(event.target.value)}
                />
              </Td>
              <Td>
                <Button colorScheme="blue" onClick={() => onAddNewRow()}>
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
