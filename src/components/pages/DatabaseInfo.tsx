import { Box, Heading } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { OrbitDBDataType, useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";

const DatabaseInfo = () => {
  let { address } = useParams<{ address: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [data, setData] = useState<OrbitDBDataType[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        if (address) {
          const db = getDatabase(address);
          setData(await db.all());
          if (data) data.map((data) => console.log(data.value));
        }
      } catch (err: any) {
        setError(`Error fetching data: ${err.message}`);
      }
    };
    fetchData();
  }, []);

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        OrbitDB Data
      </Heading>
      {error && <p>{error}</p>}
      {data && data.map((data) => <Box key={data.hash}>{data.value}</Box>)}
    </Box>
  );
};

export default DatabaseInfo;
