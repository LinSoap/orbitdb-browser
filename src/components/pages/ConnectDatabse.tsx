import { Button, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const ConnectDatabse = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<string>("");
  const { orbitDB, addDatabase, databases, recentDatabase } = useOrbitDB();

  const handleClick = async (address: string) => {
    try {
      if (orbitDB) {
        const db = await orbitDB.open(address);
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
    <>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      ></Input>
      <Button onClick={() => handleClick(address)}>Connect</Button>

      <VStack>
        {recentDatabase.map((address: string) => (
          <Button key={address} onClick={() => handleClick(address)}>
            {address}
          </Button>
        ))}
      </VStack>
    </>
  );
};

export default ConnectDatabse;
