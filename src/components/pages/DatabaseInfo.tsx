import { Box, Heading, List, ListItem } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";

const DatabaseInfo = () => {
  let { address } = useParams<{ address: string }>();
  const { orbitDB } = useOrbitDB();
  const [db, setDB] = useState<any>([]);

  // const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("/orbitdb/" + address);
        // const dbInstance = await orbitDB.open("hello");
        const dbInstance = await orbitDB.open("/orbitdb/" + address);
        console.log("DB instance:", dbInstance);
        setDB(dbInstance);
        await dbInstance.add("Hello, OrbitDB!");
        const allData = dbInstance.all();
        console.log("All data:", allData);
        // setData(allData);
      } catch (err: any) {
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      const closeDB = async () => {
        if (db) {
          await db.close();
          console.log(`Database /orbitdb/${address} closed`);
        }
      };
      closeDB();
    };
  }, [address, orbitDB]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        OrbitDB Data
      </Heading>
      {/* <List spacing={3}>
        {data.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List> */}
    </Box>
  );
};

export default DatabaseInfo;
