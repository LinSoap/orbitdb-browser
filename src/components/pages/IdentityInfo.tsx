import {
  Button,
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Card,
  Flex,
  useTheme,
  useColorMode,
  Input,
} from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useRef, useState } from "react";
import MainTitle from "../common/MainTitle";
import StyledInput from "../common/StyledInput";
import { useError } from "../../context/ErrorProvider";
import CopyIconButton from "../common/CopyIconButton";

const IdentityInfo = () => {
  const {
    identity,
    createIdentity,
    removeIdentity,
    exportIdentity,
    importIdentity,
  } = useIdentities();
  const [id, setId] = useState<string>("");
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  const bgButton = theme.colors.custom.bgButton[colorMode];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addError } = useError();

  const handleExport = async () => {
    if (identity) {
      await exportIdentity(identity);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileName = file.name;
        const id = fileName.replace("identity_", "").replace(".bin", "");

        const bytes = await file.arrayBuffer();

        await importIdentity(id, new Uint8Array(bytes));
      } catch (error) {
        addError("Failed to import identity");
      }
    }
  };

  return (
    <Card bg={bgColorMain} h={"full"}>
      <MainTitle title="Identity Info" />
      <Table>
        <Tbody>
          <Tr>
            <Td>Id</Td>
            <Td>
              {identity?.id}
              <CopyIconButton ariaLabel={"Copy id"} data={identity?.id} />
            </Td>
          </Tr>
          <Tr>
            <Td>Public Key</Td>
            <Td>{identity?.publicKey}</Td>
          </Tr>
          <Tr>
            <Td>Hash</Td>
            <Td>{identity?.hash}</Td>
          </Tr>
          <Tr>
            <Td>Type</Td>
            <Td>{identity?.type}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Box mt={4} paddingX={20}>
        <Flex align="center">
          <StyledInput
            placeholder="Enter new id"
            value={id}
            onChange={(event) => setId(event.target.value)}
            mr={2}
          />
          <Button bg={bgButton} onClick={() => createIdentity(id)} mr={2}>
            Create
          </Button>
          <Button bg={bgButton} onClick={() => removeIdentity()} mr={2}>
            Remove
          </Button>
          <Button bg={bgButton} onClick={() => handleExport()} mr={2}>
            Export
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: "none" }}
          />
          <Button
            bg={bgButton}
            onClick={() => fileInputRef.current?.click()}
            mr={2}
          >
            Import
          </Button>
        </Flex>
      </Box>
    </Card>
  );
};

export default IdentityInfo;
