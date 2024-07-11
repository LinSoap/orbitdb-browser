import { Box, Heading } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import DataForm from "../common/DataForm";
import { DatabaseType } from "../../types/Database";

const DatabaseInfo = () => {
  let { address } = useParams<{ address: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [Database, setDatabase] = useState<DatabaseType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        if (address) {
          const db = getDatabase(address);
          console.log(db);
          setDatabase(db);
        }
      } catch (err: any) {
        setError(`Error fetching data: ${err.message}`);
      }
    };
    fetchData();
  }, [address]);

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        OrbitDB Data
      </Heading>
      {error ? <p>{error}</p> : Database && <DataForm Database={Database} />}
    </Box>
  );
};

export default DatabaseInfo;
