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
import { EventsDataType } from "../../../types/Orbitdb";
import { EventsDatabaseType } from "../../../types/Database";

const EventForm = ({ Database }: { Database: EventsDatabaseType }) => {
  const [data, setData] = useState<EventsDataType[] | null>(null);
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

  const onAddNewRow = async () => {
    await Database.add(newRow);
    fetchData();
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
              <Th>Data</Th>
              <Th>Hash</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((data) => (
                <Tr key={data.hash}>
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
                  onChange={(event) => setNewRow(event.target.value)}
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

export default EventForm;
