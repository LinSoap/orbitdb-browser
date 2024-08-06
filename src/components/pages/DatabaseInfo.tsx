import { Box } from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import EventDataForm from "../common/form/EventForm";
import DocumentDataForm from "../common/form/DocumentForm";
import KeyValueForm from "../common/form/KeyValueForm";
import DatabaseInfoHeader from "../common/DatabaseInfoHeader";
import { EventsType, DocumentsType, KeyValueType } from "@orbitdb/core";

const DatabaseInfo = () => {
  let { address } = useParams<{ address: string }>();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [Database, setDatabase] = useState<
    EventsType | DocumentsType | KeyValueType
  >();
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        if (address) {
          const db = await getDatabase(address);
          if (db) {
            setDatabase(db);
          } else {
            navigate("/");
          }
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
        return <EventDataForm Database={Database as EventsType} />;
      case "documents":
        return <DocumentDataForm Database={Database as DocumentsType} />;
      case "keyvalue":
        return <KeyValueForm Database={Database as KeyValueType} />;
      default:
        return null;
    }
  };
  return (
    <Box p={4}>
      {Database ? (
        <DatabaseInfoHeader Database={Database} />
      ) : (
        <p>Database not init,Please from home open it again</p>
      )}
      {renderDataForm()}
    </Box>
  );
};

export default DatabaseInfo;
