import { useEffect, useState } from "react";
import {} from "../../../context/OrbitDBProvier";
import {
  Box,
  Button,
  IconButton,
  InputGroup,
  Select,
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
import { EventsReturn, EventsType } from "@orbitdb/core";
import { FaSearch } from "react-icons/fa";
import { isBase58 } from "../../../utils/check";

const EventForm = ({ Database }: { Database: EventsType }) => {
  const [data, setData] = useState<EventsReturn[]>();
  const [queryHash, setQueryHash] = useState<string>("");
  const [queryType, setQueryType] = useState<string>("gte");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<string>("");
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];

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

  const QueryData = async () => {
    const all = [];
    const options: { [key: string]: string | number | undefined } = {};
    try {
      if (!isBase58(queryHash)) {
        throw new Error("Invalid Hash");
      }
      if (queryType && queryHash) {
        options[queryType] = queryHash;
      }

      const amountNumber = Number(amount);
      if (amount && amountNumber > 0) {
        options.amount = amountNumber; 
      }
      for await (const record of Database.iterator(options)) {
        all.unshift(record);
      }
      setData(all);
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
      <InputGroup size="md" marginY={2}>
        <Select
          width={"auto"}
          minWidth={"auto"}
          whiteSpace={"nowrap"}
          value={queryType}
          onChange={(event) => setQueryType(event.target.value)}
          style={{ width: "auto", whiteSpace: "nowrap" }}
        >
          <option value="gt">Greater than</option>
          <option value="gte">Greater than and equal</option>
          <option value="lt">Less than</option>
          <option value="lte">Less than and equal</option>
        </Select>
        <StyledInput
          placeholder="Hash(option)"
          value={queryHash}
          onChange={(event) => setQueryHash(event.target.value)}
        />
        <StyledInput
          width={"auto"}
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
          <IconButton
            colorScheme="gray"
            aria-label="Search database"
            icon={<FaSearch />}
            onClick={() => QueryData()}
          />
      </InputGroup>
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
                <Box>
                  <StyledInput
                    htmlSize={4}
                    value={newRow}
                    onChange={(event) => setNewRow(event.target.value)}
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

export default EventForm;
