import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  List,
  ListItem,
  Tag,
  TagLabel,
  Td,
  Tr,
} from "@chakra-ui/react";
import { DocumentsReturn, DocumentsValue } from "@orbitdb/core";
import { useState } from "react";
import StyledInput from "../StyledInput";
import DocumentsEditItem from "./DocumentsEditItem";

const DocumentsItem = ({
  data,
  isRaw,
  indexBy,
  updateItem,
  deleteItem,
}: {
  data: DocumentsReturn;
  isRaw: boolean;
  indexBy: string;
  updateItem: (update: { [key: string]: any }) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rawValue, setRawValue] = useState<string>(JSON.stringify(data.value));
  const [newValue, setNewValue] = useState<DocumentsValue>(data.value);
  const handleChange = (value: string) => {
    setRawValue(value);
  };

  const handleClostEdit = () => {
    setIsEditing(false);
    setNewValue(data.value);
  };

  console.log(newValue);

  const formatValueItem = (data: DocumentsValue) => {
    return (
      <Flex wrap="wrap" gap={2}>
        {Object.entries(data).map(([key, value]) => (
          <Tag key={key}>
            <TagLabel>
              {indexBy === key ? "*" + key : key}:{value}
            </TagLabel>
          </Tag>
        ))}
      </Flex>
    );
  };

  const formatEditList = (data: DocumentsValue) => {
    return (
      <List>
        {Object.entries(data).map(([key, value], index) => (
          <ListItem key={key}>
            <DocumentsEditItem
              index={index}
              itemKey={key}
              value={value}
              indexBy={indexBy}
              setNewValue={setNewValue}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return isEditing ? (
    <Tr key={data.hash}>
      <Td>{data.key}</Td>
      <Td>
        {isRaw ? (
          <StyledInput
            htmlSize={4}
            value={rawValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          formatEditList(newValue)
        )}
      </Td>
      <Td>{data.hash}</Td>
      <Td>
        <IconButton
          aria-label="Update Item"
          icon={<CheckIcon />}
          onClick={() => {
            setIsEditing(!isEditing);
            updateItem(newValue);
          }}
        />
        <IconButton
          aria-label="Close Item"
          icon={<CloseIcon />}
          onClick={() => handleClostEdit()}
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Delete Item"
          icon={<DeleteIcon />}
          onClick={() => deleteItem(data.key)}
        />
      </Td>
    </Tr>
  ) : (
    <Tr key={data.hash}>
      <Td>{data.key}</Td>
      <Td>{isRaw ? rawValue : formatValueItem(data.value)}</Td>
      <Td>{data.hash}</Td>
      <Td>
        <IconButton
          aria-label="Edit Item"
          icon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Delete Item"
          icon={<DeleteIcon />}
          onClick={() => deleteItem(data.key)}
        />
      </Td>
    </Tr>
  );
};

export default DocumentsItem;