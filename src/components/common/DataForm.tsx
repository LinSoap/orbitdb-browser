import { useEffect, useState } from "react";
import {} from "../../context/OrbitDBProvier";
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
import { DatabaseType } from "../../types/Database";
import { OrbitDBDataType } from "../../types/Orbitdb";

const DataForm = ({ Database }: { Database: DatabaseType }) => {
  const [data, setData] = useState<OrbitDBDataType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<string>("");
  const fetchData = async () => {
    setError(null);
    setNewRow("");
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

  const onAddNewRow = async (data: string) => {
    await Database.add(data);
    fetchData();
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Th>Data</Th>
            <Th>Hash</Th>
          </Thead>
          <Tbody>
            {data &&
              data.map((data) => (
                <Tr>
                  <Td>{data.value}</Td>
                  <Td>{data.hash}</Td>
                </Tr>
              ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td>
                <Input
                  htmlSize={4}
                  width="auto"
                  onChange={(event) => setNewRow(event.target.value)}
                />
              </Td>
              <Td>
                <Button colorScheme="blue" onClick={() => onAddNewRow(newRow)}>
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

export default DataForm;
