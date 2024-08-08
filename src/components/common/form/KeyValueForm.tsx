import { useEffect, useState } from "react";
import {} from "../../../context/OrbitDBProvier";
import {
  Box,
  Button,
  IconButton,
  InputGroup,
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
import KeyValueItem from "./KeyValueItem";
import StyledInput from "../StyledInput";
import { KeyValueReturn, KeyValueType } from "@orbitdb/core";
import { FaSearch } from "react-icons/fa";

const KeyValueForm = ({ Database }: { Database: KeyValueType }) => {
  const [data, setData] = useState<KeyValueReturn[]>();
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];
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

  const QueryData = async () => {
    const all = [];
    try {
      const amountNumber = Number(amount);
      console.log(amountNumber)
      if(amountNumber <= 0 ){
        fetchData();
      }else{
        for await (const record of Database.iterator({amount:Number(amount)})) {
         all.unshift(record);
        }
        setData(all);
      }
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
    }
  };


  return (
    <div>
      {error && <p>{error}</p>}
        <InputGroup size="md" marginY={2}>
        <StyledInput
          placeholder="Amount(Number)"
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
                  key={data.hash}
                  data={data}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                />
              ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td>
                <Box>
                  <StyledInput
                    htmlSize={4}
                    value={key}
                    onChange={(event) => setKey(event.target.value)}
                  />
                </Box>
              </Td>
              <Td>
                <Box>
                  <StyledInput
                    htmlSize={4}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </Box>
              </Td>
              <Td>
                <Button bg={bgButton} onClick={() => addNewItem()}>
                  Add New Row
                </Button>
              </Td>
              <Td />
              <Td />
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </div>
  );
};

export default KeyValueForm;
