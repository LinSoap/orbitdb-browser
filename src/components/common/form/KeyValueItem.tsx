import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Spacer, Td, Tr, Text } from "@chakra-ui/react";
import { KeyValueReturn } from "@orbitdb/core";
import { useState } from "react";
import StyledInput from "../StyledInput";
import CopyIconButton from "../CopyIconButton";

const KeyValueItem = ({
  data,
  updateItem,
  deleteItem,
}: {
  data: KeyValueReturn;
  updateItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(data.value);

  return isEditing ? (
    <Tr key={data.hash}>
      <Td>{data.key}</Td>
      <Td>
        <StyledInput
          htmlSize={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Td>
      <Td>{data.hash}</Td>
      <Td>
        <IconButton
          aria-label="Update Item"
          icon={<CheckIcon />}
          onClick={() => {
            setIsEditing(!isEditing);
            updateItem(data.key, value);
          }}
        />
        <IconButton
          aria-label="Close Item"
          icon={<CloseIcon />}
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
  ) : (
    <Tr key={data.hash}>
      <Td>{data.key}</Td>
      <Td>{data.value}</Td>
      <Td>
        <Flex alignItems="center">
          <Text>{data.hash}</Text>
          <Spacer />
          <CopyIconButton ariaLabel={"Copy hash"} data={data.hash} />
        </Flex>
      </Td>
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

export default KeyValueItem;
