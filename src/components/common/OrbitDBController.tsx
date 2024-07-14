import { CloseIcon } from "@chakra-ui/icons";
import { Button, HStack, IconButton, Input } from "@chakra-ui/react";

import { FaCheck } from "react-icons/fa";

const OrbitDBController = ({
  writers,
  setWriters,
  grantID,
  revokeID,
}: {
  writers: Set<string>;
  setWriters: (writers: Set<string>) => void;
  grantID: (ID: string) => Promise<void>;
  revokeID: (ID: string) => Promise<void>;
}) => {
  const handleInputChange = (index: number, value: string) => {
    setWriters((prevWriters) => {
      const newWriters = [...prevWriters];
      newWriters[index] = value;
      return newWriters;
    });
  };
  return (
    <>
      <h1>OrbitDBWriters</h1>
      {Array.from(writers || []).map((id: string, index: number) => (
        <HStack key={index}>
          <Input
            type="text"
            placeholder="Wriable ID"
            value={id}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
          <IconButton
            aria-label="drop"
            icon={<FaCheck />}
            onClick={() => grantID(id)}
          />
          <IconButton
            aria-label="drop"
            icon={<CloseIcon />}
            onClick={() => revokeID(id)}
          />
        </HStack>
      ))}
      <Button
        onClick={() =>
          setWriters((prevWriters: Set<string>) => [...prevWriters, ""])
        }
      >
        Add ID
      </Button>
    </>
  );
};

export default OrbitDBController;
