import { Box, Tag, TagLabel } from "@chakra-ui/react";
import { useState } from "react";
import StyledInput from "../StyledInput";
import { DocumentsValue } from "@orbitdb/core";

const DocumentsEditItem = ({
  index,
  itemKey,
  value,
  indexBy,
  setNewValue,
}: {
  index: number;
  itemKey: string;
  value: string;
  indexBy: string;
  setNewValue: React.Dispatch<React.SetStateAction<DocumentsValue>>;
}) => {
  const [key, setKey] = useState(itemKey);
  const [editItem, setEditItem] = useState({ [key]: value });

  function handleBlur() {
    setNewValue((prevValue) => {
      const updatedEntries = Object.entries(prevValue).map(([k, v], i) =>
        i === index ? [key, editItem[key]] : [k, v]
      );
      return Object.fromEntries(updatedEntries);
    });
  }

  const handleKeyChange = (newKey: string, newValue: string) => {
    setEditItem({ [newKey]: newValue });
    setKey(newKey);
  };

  return (
    <Tag>
      {indexBy === key ? (
        <TagLabel>
          {indexBy === key ? "*" + key : key}:{value}
        </TagLabel>
      ) : (
        <Box>
          <StyledInput
            value={key}
            w={"auto"}
            onChange={(e) => handleKeyChange(e.target.value, editItem[key])}
            onBlur={handleBlur}
          />
          :
          <StyledInput
            value={editItem[key]}
            w={"auto"}
            onChange={(e) => setEditItem({ [key]: e.target.value })}
            onBlur={handleBlur}
          />
        </Box>
      )}
    </Tag>
  );
};

export default DocumentsEditItem;
