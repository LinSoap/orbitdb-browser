import { useState } from "react";
import { useIpfs } from "../../hooks/useIpfs";
import { useOrbitDB } from "../../hooks/useOrbitDB";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useIdentities } from "../../hooks/useIdentities";
import { DatabaseConfig } from "../../services/orbitdb.service";
import { ComposedStorage, Events, IPFSAccessController } from "@orbitdb/core";

const AddDatabase = () => {
  const ipfs = useIpfs();
  const { orbitDB } = useOrbitDB();
  const { identities } = useIdentities();

  const [formData, setFormData] = useState<DatabaseConfig>({
    address: "",
    params: {
      type: "event",
      meta: "", // 默认为空对象
      sync: true, // 默认为 true
      Database: Events, // 默认为 undefined
      AccessController: IPFSAccessController, // 默认为 undefined
      headsStorage: ComposedStorage, // 默认为 undefined
      entryStorage: ComposedStorage, // 默认为 undefined
      indexStorage: ComposedStorage, // 默认为 undefined
      referencesCount: undefined, // 默认为 0，或者根据需要设置其他默认值
    },
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      params: {
        ...formData.params,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // try {
    //   await orbitDB.createDatabase(formData);
    //   alert("Database created successfully!");
    // } catch (error) {
    //   console.error("Error creating database:", error);
    //   alert("Failed to create database.");
    // }
  };

  return (
    <Box p={5}>
      {ipfs ? (
        <Box>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  name="address"
                  placeholder="String Or OrbitDB Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select
                  name="type"
                  value={formData.params.type}
                  onChange={handleChange}
                >
                  <option value="event">Event</option>
                  <option value="documents">Documents</option>
                  <option value="keyvalue">Key-Value</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Meta</FormLabel>
                <Input
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
                  value={formData.params.AccessController.name}
                  onChange={handleChange}
                >
                  <option value="event">IPFSAccessController</option>
                  <option value="documents">OrbitDBAccessController</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>References Count</FormLabel>
                <Input
                  type="number"
                  name="referencesCount"
                  value={formData.params.referencesCount}
                  onChange={handleChange}
                />
              </FormControl>
              <Button type="submit" colorScheme="teal">
                Create Database
              </Button>
            </VStack>
          </form>
        </Box>
      ) : (
        <Box>Loading IPFS Service...</Box>
      )}
    </Box>
  );
};

export default AddDatabase;
