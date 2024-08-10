import { Tag, TagLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    return () => {
      console.log("Component is being unmounted");
      console.log(key, editItem[key]);
      console.log("edit" + JSON.stringify(editItem));
      updateNewValue();
    };
  }, []);

  const updateNewValue = () => {
    setNewValue((prevValue) => {
      const updatedEntries = Object.entries(prevValue).map(([k, v], i) =>
        i === index ? [key, editItem[key]] : [k, v]
      );
      // console.log(Object.fromEntries(updatedEntries));
      return Object.fromEntries(updatedEntries);
    });
  };

  const handleKeyChange = (newKey: string, newValue: string) => {
    setEditItem({ [newKey]: newValue });
    setKey(newKey);
    console.log(editItem);
    updateNewValue();
  };

  return (
    <Tag>
      {indexBy === key ? (
        <TagLabel>* {key}</TagLabel>
      ) : (
        <StyledInput
          value={key}
          w={"auto"}
          onChange={(e) => handleKeyChange(e.target.value, editItem[key])}
        />
      )}
      :
      {
        <StyledInput
          value={editItem[key]}
          w={"auto"}
          onChange={(e) => setEditItem({ [key]: e.target.value })}
        />
      }
    </Tag>
  );
};

export default DocumentsEditItem;
