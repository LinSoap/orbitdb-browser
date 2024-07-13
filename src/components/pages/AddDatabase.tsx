import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

import {
  ComposedStorage,
  Documents,
  Events,
  IPFSAccessController,
  IPFSBlockStorage,
  KeyValue,
  LRUStorage,
  LevelStorage,
  MemoryStorage,
  OrbitDBAccessController,
} from "@orbitdb/core";
import { useNavigate } from "react-router-dom";
import { useIpfs } from "../../context/IpfsProvider";
import { DatabaseConfig } from "../../interface/DatabaseConfig";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useIdentities } from "../../context/IdentitiesProvider";
import { CloseIcon } from "@chakra-ui/icons";

const AddDatabase = () => {
  const navigate = useNavigate();
  const { ipfs } = useIpfs();
  const { identity } = useIdentities();
  const { orbitDB, addDatabase, databases } = useOrbitDB();
  const [writers, setWriters] = useState<string[]>([]);
  const [formData, setFormData] = useState<DatabaseConfig>({
    address: "",
    params: {
      type: "events",
      meta: "",
      sync: true,
      Database: Events,
      AccessController: IPFSAccessController,
      headsStorage: ComposedStorage,
      entryStorage: ComposedStorage,
      indexStorage: ComposedStorage,
      referencesCount: 0,
    },
  });

  useEffect(() => {
    if (identity) {
      setWriters([identity.id]);
    }
  }, [identity]);

  const accessControllerMapping: {
    [key: string]: DatabaseConfig["params"]["AccessController"];
  } = {
    IPFSAccessController: IPFSAccessController,
    OrbitDBAccessController: OrbitDBAccessController,
  };

  const databaseMapping: {
    [key: string]: DatabaseConfig["params"]["Database"];
  } = {
    event: Events,
    documents: Documents,
    keyvalue: KeyValue,
  };

  const storageMapping: {
    [key: string]: DatabaseConfig["params"]["headsStorage"];
  } = {
    IPFSBlockStorage: IPFSBlockStorage,
    LevelStorage: LevelStorage,
    ComposedStorage: ComposedStorage,
    LRUStorage: LRUStorage,
    MemoryStorage: MemoryStorage,
  };

  const getStorageKey = (mapping: any, value: any) => {
    return Object.keys(mapping).find((key) => mapping[key] === value) || "";
  };

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
    if (name === "type") {
      newParams.Database = databaseMapping[value];
    }
    if (name === "AccessController") {
      newParams.AccessController = accessControllerMapping[value];
    }
    if (
      name === "headsStorage" ||
      name === "entryStorage" ||
      name === "indexStorage"
    ) {
      newParams[name] = storageMapping[value];
    }
    setFormData({
      ...formData,
      params: newParams,
    });
    console.log(formData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (orbitDB) {
        const db = await orbitDB.open(formData.address, {
          type: formData.params.type,
          AccessController:
            formData.params.AccessController === IPFSAccessController
              ? IPFSAccessController({
                  write: writers,
                })
              : OrbitDBAccessController({ write: writers }),
        });
        if (db) {
          if (!databases.some((database) => database.address === db.address)) {
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
                  value={
                    Object.keys(accessControllerMapping).find(
                      (key) =>
                        accessControllerMapping[key] ===
                        formData.params.AccessController
                    ) || ""
                  }
                  onChange={handleChange}
                >
                  <option value="IPFSAccessController">
                    IPFSAccessController
                  </option>
                  <option value="OrbitDBAccessController">
                    OrbitDBAccessController
                  </option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Writable ID:</FormLabel>
                {writers.map((id, index) => (
                  <HStack key={index}>
                    <Input
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
                >
                  Add ID
                </Button>
              </FormControl>
              <FormControl>
                <FormLabel>headsStorage</FormLabel>
                <Select
                  name="headsStorage"
                  value={getStorageKey(
                    storageMapping,
                    formData.params.headsStorage
                  )}
                  onChange={handleChange}
                  isReadOnly={true}
                >
                  <option value="IPFSBlockStorage">IPFSBlockStorage</option>
                  <option value="LevelStorage">LevelStorage</option>
                  <option value="ComposedStorage">ComposedStorage</option>
                  <option value="LRUStorage">LRUStorage</option>
                  <option value="MemoryStorage">MemoryStorage</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>EntryStorage</FormLabel>
                <Select
                  name="entryStorage"
                  value={getStorageKey(
                    storageMapping,
                    formData.params.entryStorage
                  )}
                  onChange={handleChange}
                  isReadOnly={true}
                >
                  <option value="IPFSBlockStorage">IPFSBlockStorage</option>
                  <option value="LevelStorage">LevelStorage</option>
                  <option value="ComposedStorage">ComposedStorage</option>
                  <option value="LRUStorage">LRUStorage</option>
                  <option value="MemoryStorage">MemoryStorage</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>IndexStorage</FormLabel>
                <Select
                  name="indexStorage"
                  value={getStorageKey(
                    storageMapping,
                    formData.params.indexStorage
                  )}
                  onChange={handleChange}
                  isReadOnly={true}
                >
                  <option value="IPFSBlockStorage">IPFSBlockStorage</option>
                  <option value="LevelStorage">LevelStorage</option>
                  <option value="ComposedStorage">ComposedStorage</option>
                  <option value="LRUStorage">LRUStorage</option>
                  <option value="MemoryStorage">MemoryStorage</option>
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
