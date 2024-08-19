import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  InputGroup,
  List,
  ListItem,
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
import { DocumentsReturn, DocumentsType, DocumentsValue } from "@orbitdb/core";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";
import DocumentsItem from "./DocumentsItem";
import DocumentsEditItem from "./DocumentsEditItem";
import { AddIcon } from "@chakra-ui/icons";

const DocumentForm = ({ Database }: { Database: DocumentsType }) => {
  const [data, setData] = useState<DocumentsReturn[]>();
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isRaw, setIsRaw] = useState<boolean>(false);
  const [rawValue, setRawValue] = useState<string>("");
  const [newValue, setNewValue] = useState<DocumentsValue>({
    _id: "",
  });
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];

  const fetchData = async () => {
    setError(null);
    setNewValue({ _id: "" });
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

  const updateItem = async (update: DocumentsValue) => {
    await Database.put(update);
    fetchData();
  };

  const addNewItem = async (newItem: DocumentsValue | string) => {
    if (typeof newItem === "string") {
      try {
        const parsedItem = JSON.parse(newItem) as DocumentsValue;
        await Database.put(parsedItem);
      } catch (error) {
        console.error("无法解析字符串为有效的 DocumentsValue:", error);
      }
    } else {
      await updateItem(newItem);
    }
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
                  {isRaw ? null : (
                    <StyledInput
                      value={newValue._id}
                      htmlSize={4}
                      onChange={(event) => {
                        setNewValue({ ...newValue, _id: event.target.value });
                        console.log(newValue);
                      }}
                    />
                  )}
                </Box>
              </Td>
              <Td>
                <Box>
                  {isRaw ? (
                    <StyledInput
                      value={rawValue}
                      htmlSize={4}
                      onChange={(event) => setRawValue(event.target.value)}
                    />
                  ) : (
                    <List>
                      {Object.entries(newValue).map(([key, value], index) =>
                        Database.indexBy === key ? null : (
                          <ListItem key={key}>
                            <DocumentsEditItem
                              index={index}
                              itemKey={key}
                              value={value}
                              setNewValue={setNewValue}
                            />
                          </ListItem>
                        )
                      )}
                      <ListItem>
                        <IconButton
                          icon={<AddIcon />}
                          aria-label={"add new prop"}
                          onClick={() => {
                            const newKey = `Key${
                              Object.keys(newValue).length + 1
                            }`;
                            setNewValue((prevValue) => ({
                              ...prevValue,
                              [newKey]: "",
                            }));
                          }}
                        />
                      </ListItem>
                    </List>
                  )}
                </Box>
              </Td>
              <Td>
                <Button
                  bg={bgButton}
                  onClick={() => addNewItem(isRaw ? rawValue : newValue)}
                >
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
