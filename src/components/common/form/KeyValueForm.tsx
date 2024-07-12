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
import { KeyValueDatabaseType } from "../../../types/Database";
import { KeyValueDataType } from "../../../types/Orbitdb";
import KeyValueItem from "../KeyValueItem";

const KeyValueForm = ({ Database }: { Database: KeyValueDatabaseType }) => {
  const [data, setData] = useState<KeyValueDataType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const fetchData = async () => {
    setError(null);
    setKey("");
    setValue("");
    try {
      console.log(Database.type);
      setData(await Database.all());
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
    }
  };
  useEffect(() => {
    fetchData();
  }, [Database]);

  const addNewItem = async () => {
    await Database.put(key, value);
    fetchData();
  };
  const updateItem = async (key: string, value: string) => {
    await Database.put(key, value);
    fetchData();
  };

  const deleteItem = async (key: string) => {
    await Database.del(key);
    fetchData();
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
              <Th>Hash</Th>
              <Th>Eidt</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((data) => (
                <KeyValueItem
                  data={data}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                />
              ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td>
                <Input
                  htmlSize={4}
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                />
              </Td>
              <Td>
                <Input
                  htmlSize={4}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
              </Td>
              <Td>
                <Button colorScheme="blue" onClick={() => addNewItem()}>
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

export default KeyValueForm;
