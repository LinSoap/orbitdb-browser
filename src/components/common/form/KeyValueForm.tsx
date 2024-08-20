import { useEffect, useState } from "react";
import {} from "../../../context/OrbitDBProvier";
import {
  Box,
  Button,
  HStack,
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
import Pagination from "./Pagination";
import { useError } from "../../../context/ErrorProvider";

const KeyValueForm = ({
  Database,
  writerble,
}: {
  Database: KeyValueType;
  writerble: boolean;
}) => {
  const [data, setData] = useState<KeyValueReturn[]>();
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const { colorMode } = useColorMode();
  const { addError } = useError();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];
  const fetchData = async () => {
    setKey("");
    setValue("");
    try {
      setData(await Database.all());
    } catch (err: any) {
      addError(`Error fetching data: ${err.message}`);
    }
  };
  useEffect(() => {
    fetchData();
  }, [Database]);

  useEffect(() => {
    if (data) {
      setTotalPage(data.length === 0 ? 1 : Math.ceil(data.length / 10));
      setCurrentPage(totalPage);
    }
  }, [data]);

  const addNewItem = async () => {
    await Database.put(key, value);
    fetchData();
  };
  const updateItem = async (key: string, value: string) => {
    if (writerble) {
      await Database.put(key, value);
      fetchData();
    } else {
      addError("You are not allowed to edit this Database");
    }
  };

  const deleteItem = async (key: string) => {
    if (writerble) {
      await Database.del(key);
      fetchData();
    } else {
      addError("You are not allowed to edit this Database");
    }
  };

  const QueryData = async () => {
    const all = [];
    try {
      const amountNumber = Number(amount);
      if (amountNumber <= 0) {
        fetchData();
      } else {
        for await (const record of Database.iterator({
          amount: Number(amount),
        })) {
          all.unshift(record);
        }
        setData(all);
      }
    } catch (err: any) {
      addError(`Error fetching data: ${err.message}`);
    }
  };

  return (
    <div>
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
      <HStack justifyContent={"space-between"}>
        {data?.length === 0 ? (
          <p>This Database is Empty </p>
        ) : (
          <p>Total Item:{data?.length}</p>
        )}
        <Pagination
          totalPage={totalPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </HStack>
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
              data
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((data) => (
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
