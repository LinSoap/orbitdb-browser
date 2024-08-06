import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Select,
  useColorMode,
  useTheme,
  VStack,
} from "@chakra-ui/react";

import { IPFSAccessController, OrbitDBAccessController } from "@orbitdb/core";
import { useNavigate } from "react-router-dom";
import { useIpfs } from "../../context/IpfsProvider";
import { DatabaseConfig } from "../../interface/DatabaseConfig";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useIdentities } from "../../context/IdentitiesProvider";
import { CloseIcon } from "@chakra-ui/icons";
import MainTitle from "../common/MainTitle";
import StyledInput from "../common/StyledInput";

const CreateDatabase = () => {
  const navigate = useNavigate();
  const { ipfs } = useIpfs();
  const { identity } = useIdentities();
  const { orbitDB, addDatabase, databases } = useOrbitDB();
  const [writers, setWriters] = useState<string[]>([]);
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  const bgButton = theme.colors.custom.bgButton[colorMode];

  const [formData, setFormData] = useState<DatabaseConfig>({
    address: "",
    params: {
      type: "events",
      meta: "",
      sync: true,
      AccessController: "ipfs",
      referencesCount: 0,
    },
  });

  useEffect(() => {
    if (identity) {
      setWriters([identity.id]);
    }
  }, [identity]);

  const handleWriterChange = (e: any, index: number) => {
    const { value } = e.target;
    const newWriters = [...writers];
    newWriters[index] = value;
    setWriters(newWriters);
  };
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newParams = {
      ...formData.params,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData({
      ...formData,
      params: newParams,
    });
    console.log(formData);
    console.log(writers);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (orbitDB) {
        const db = await orbitDB.open(formData.address, {
          type: formData.params.type,
          meta: formData.params.meta,
          AccessController:
            formData.params.AccessController === "ipfs"
              ? IPFSAccessController({
                  write: writers,
                })
              : OrbitDBAccessController({ write: writers }),
        });
        if (db) {
          if (
            !databases.some((database: any) => database.address === db.address)
          ) {
            addDatabase(db);
          }
          navigate("/database-info" + db.address);
        }
      }
    } catch (error) {
      console.error("Error opening database:", error);
    }
  };

  return (
    <Card bg={bgColorMain}>
      <MainTitle title="Create Database" />
      {ipfs ? (
        <Box p={4}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <StyledInput
                  type="text"
                  name="address"
                  placeholder="String Or OrbitDB Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select
                  name="type"
                  value={formData.params.type}
                  onChange={handleChange}
                >
                  <option value="events">Event</option>
                  <option value="documents">Documents</option>
                  <option value="keyvalue">Key-Value</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Meta</FormLabel>
                <StyledInput
                  type="text"
                  name="meta"
                  placeholder="Char"
                  value={formData.params.meta}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="sync"
                  colorScheme="gray"
                  isChecked={formData.params.sync}
                  onChange={(e) => handleChange(e)}
                >
                  Sync Automatically
                </Checkbox>
              </FormControl>
              <FormControl>
                <FormLabel>AccessController</FormLabel>
                <Select
                  name="AccessController"
                  value={formData.params.AccessController}
                  onChange={handleChange}
                >
                  <option value="ipfs">IPFSAccessController</option>
                  <option value="orbitdb">OrbitDBAccessController</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Writable ID:</FormLabel>
                {writers.map((id, index) => (
                  <HStack key={index} p={"3px"}>
                    <StyledInput
                      type="text"
                      placeholder="Wriable ID"
                      value={id}
                      onChange={(e) => handleWriterChange(e, index)}
                    />
                    <IconButton
                      aria-label="drop"
                      icon={<CloseIcon />}
                      onClick={() =>
                        setWriters((prevWriters) =>
                          prevWriters.filter((_, i) => i !== index)
                        )
                      }
                    />
                  </HStack>
                ))}
                <Button
                  onClick={() =>
                    setWriters((prevWriters) => [...prevWriters, ""])
                  }
                  bg={bgButton}
                >
                  Add ID
                </Button>
              </FormControl>
              <FormControl>
                <FormLabel>References Count</FormLabel>
                <StyledInput
                  type="number"
                  name="referencesCount"
                  value={formData.params.referencesCount}
                  onChange={handleChange}
                />
              </FormControl>
              <Button type="submit" bg={bgButton}>
                Create Database
              </Button>
            </VStack>
          </form>
        </Box>
      ) : (
        <Box>Loading IPFS Service...</Box>
      )}
    </Card>
  );
};

export default CreateDatabase;
