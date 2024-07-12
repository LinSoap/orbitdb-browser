import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton, Input, Td, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { KeyValueDataType } from "../../types/Orbitdb";

const KeyValueItem = ({
  data,
  updateItem,
  deleteItem,
}: {
  data: KeyValueDataType;
  updateItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [key, setKey] = useState<string>(data.key);
  const [value, setValue] = useState<string>(data.value);

  return isEditing ? (
    <Tr key={data.hash}>
      <Td>
        <Input
          htmlSize={4}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </Td>
      <Td>
        <Input
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
            updateItem(key, value);
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

export default KeyValueItem;
