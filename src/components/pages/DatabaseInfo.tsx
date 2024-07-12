import { Box, Heading } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import {
  DocumentsDatabaseType,
  EventsDatabaseType,
  KeyValueDatabaseType,
} from "../../types/Database";
import EventDataForm from "../common/form/EventForm";
import DocumentDataForm from "../common/form/DocumentForm";
import KeyValueForm from "../common/form/KeyValueForm";

const DatabaseInfo = () => {
  let { address } = useParams<{ address: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [Database, setDatabase] = useState<
    EventsDatabaseType | DocumentsDatabaseType | KeyValueDatabaseType | null
  >(null);
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        if (address) {
          const db = await getDatabase(address);
          console.log(db);
          setDatabase(db);
        }
      } catch (err: any) {
        setError(`Error fetching data: ${err.message}`);
      }
    };
    fetchData();
  }, [address, getDatabase]);

  const renderDataForm = () => {
    if (error) {
      return <p>{error}</p>;
    }
    switch (Database?.type) {
      case "events":
        return <EventDataForm Database={Database} />;
      case "documents":
        return <DocumentDataForm Database={Database} />;
      case "keyvalue":
        return <KeyValueForm Database={Database} />;
      default:
        return null;
    }
  };
  return (
    <Box p={4}>
      <Heading fontSize={20}>OrbitDB Database: {Database?.address}</Heading>
      <Heading fontSize={18}>Type: {Database?.type}</Heading>
      {renderDataForm()}
    </Box>
  );
};

export default DatabaseInfo;
