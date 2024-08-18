import { useEffect, useState } from "react";
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
import StyledInput from "../StyledInput";
import { DocumentsReturn, DocumentsType } from "@orbitdb/core";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";
import DocumentsItem from "./DocumentsItem";

const DocumentForm = ({ Database }: { Database: DocumentsType }) => {
  const [data, setData] = useState<DocumentsReturn[]>();
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewkey] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isRaw, setIsRaw] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string>("");
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];

  const fetchData = async () => {
    setError(null);
    setNewkey("");
    setNewValue("");
    try {
      setData(await Database.all());
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
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

  const onAddNewRow = async () => {
    await Database.put({ _id: newKey, newValue });
    fetchData();
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
      setError(`Error fetching data: ${err.message}`);
    }
  };

  const updateItem = async (update: { [key: string]: string }) => {
    console.log(update);
    await Database.put(update);
    fetchData();
  };

  const deleteItem = async (key: string) => {
    await Database.del(key);
    fetchData();
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
      <HStack justifyContent={"space-between"}>
        {data?.length === 0 ? (
          <p>This Database is Empty </p>
        ) : (
          <p>Total Item:{data?.length}</p>
        )}
        <HStack>
          <Button colorScheme="gray" onClick={() => setIsRaw(!isRaw)}>
            {isRaw ? "Raw" : "KeyValue"}
          </Button>
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </HStack>
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
                  <DocumentsItem
                    key={data.hash}
                    data={data}
                    isRaw={isRaw}
                    indexBy={Database.indexBy}
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
              <Td />
              <Td />
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DocumentForm;
